import logging
import re
import nest_asyncio
nest_asyncio.apply()

import openai
# from pypdf import PdfReader  # Removed in favor of LlamaParse
from llama_parse import LlamaParse
from llama_index.core.node_parser import MarkdownNodeParser
from django.conf import settings
from apps.institutional.models import UploadedDocument, DocumentChunk

logger = logging.getLogger(__name__)

# Configurar OpenAI (asegúrate de que settings.OPENAI_API_KEY esté seteado)
openai.api_key = settings.OPENAI_API_KEY

def sanitize_text(text):
    """
    Elimina/Enmascara datos sensibles (emails, teléfonos, IPs, contraseñas) del texto de forma proactiva.
    Se ejecuta ANTES de que el texto se guarde en la Base de Datos.
    """
    if not text:
        return text
        
    # 1. Censurar correos electrónicos
    text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', '[CORREO_CENSURADO]', text)
    
    # 2. Censurar posibles contraseñas (heurística básica con palabras clave)
    text = re.sub(r'(?i)(contraseña|password|clave|credencial|token)[\s:=]+[^\s\n,]+', r'\1: [CENSURADO]', text)
    
    # 3. Censurar direcciones IP (IPv4)
    text = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', '[IP_CENSURADA]', text)
    
    # 4. Teléfonos (celebramos números de 8 a 15 dígitos como posibles teléfonos)
    text = re.sub(r'\b\d{8,15}\b', '[TELEFONO_CENSURADO]', text)
    
    return text

def get_embedding(text):
    """Genera el embedding para un texto dado usando OpenAI."""
    text = text.replace("\n", " ")
    try:
        response = openai.embeddings.create(
            input=[text],
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generando embedding: {e}")
        return None

def extract_text_from_pdf(file_path):
    """
    Usa LlamaParse para extraer texto optimizado (Markdown) de PDFs complejos.
    """
    try:
        parser = LlamaParse(
            api_key=settings.LLAMA_CLOUD_API_KEY,
            result_type="markdown",  # Clave: Esto reconstruye las tablas perfectamente
            language="es",  # Opcional, ayuda con el español
            verbose=True
        )

        # LlamaParse procesa el archivo
        documents = parser.load_data(file_path)
        return documents
        
        # Unir todas las páginas en un solo texto (YA NO SE USA, RETORNAMOS DOCS)
        # full_text = "\n\n".join([doc.text for doc in documents])
        # return full_text
    except Exception as e:
        logger.error(f"Error extracting text with LlamaParse: {e}")
        raise e

def process_pdf(document_id):
    """
    Procesa un UploadedDocument:
    1. Lee el PDF
    2. Extrae texto
    3. Divide en chunks
    4. Genera embeddings
    5. Guarda DocumentChunks
    """
    try:
        doc = UploadedDocument.objects.get(id=document_id)
        logger.info(f"Procesando documento: {doc.title}")
        
        # 1. Leer PDF con LlamaParse
        # reader = PdfReader(doc.file.path)
        # full_text = ""
        # for page in reader.pages:
        #     full_text += page.extract_text() + "\n"
        
        # 1. Leer PDF con LlamaParse y obtener Documentos
        documents = extract_text_from_pdf(doc.file.path)
            
        if not documents:
            logger.warning("El PDF parece estar vacío o no contiene documentos.")
            return

        # 2. Chunking inteligente con MarkdownNodeParser (LlamaIndex)
        # Esto respeta la estructura de Markdown (tablas, headers)
        parser = MarkdownNodeParser()
        nodes = parser.get_nodes_from_documents(documents)
        
        chunks = [node.text for node in nodes]

        # 3. Eliminar chunks anteriores si existen (re-procesamiento)
        doc.chunks.all().delete()
        
        # 4. Generar Embeddings y Guardar
        chunk_objects = []
        for i, text_chunk in enumerate(chunks):
            # SANITIZACIÓN
            clean_text = sanitize_text(text_chunk)
            
            embedding = get_embedding(clean_text)
            if embedding:
                chunk_obj = DocumentChunk(
                    document=doc,
                    chunk_text=clean_text,
                    chunk_index=i,
                    embedding=embedding
                )
                chunk_objects.append(chunk_obj)
        
        # Bulk create es mucho más eficiente
        if chunk_objects:
            DocumentChunk.objects.bulk_create(chunk_objects)
            logger.info(f"Guardados {len(chunk_objects)} chunks para {doc.title}")
            
    except UploadedDocument.DoesNotExist:
        logger.error(f"Documento ID {document_id} no encontrado.")
    except Exception as e:
        logger.error(f"Error procesando PDF ({document_id}): {e}")
