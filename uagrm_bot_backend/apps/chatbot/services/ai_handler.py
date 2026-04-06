import openai
import re
from django.conf import settings
from apps.chatbot.services.knowledge_retriever import search_knowledge_base

openai.api_key = settings.OPENAI_API_KEY

def get_openai_response(user_text, context_text=""):
    """
    Envía el mensaje a OpenAI con un contexto académico inyectado.
    """
    system_prompt = "Eres un asistente útil de la UAGRM. Responde basándote estrictamente en el contexto proporcionado. Ordena la información de manera clara y concisa (Haz una lista de pasos si ses necesario segun la informacion)."
    
    # Construimos el mensaje completo con el contexto
    messages = [
        {"role": "system", "content": f"{system_prompt}\n\nCONTEXTO:\n{context_text}"},
        {"role": "user", "content": user_text}
    ]

    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # O "gpt-3.5-turbo" si prefieres
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        bot_reply = response.choices[0].message.content.strip()
        tokens = response.usage.total_tokens if response.usage else 0
        
        return bot_reply, tokens

    except Exception as e:
        print(f"Error OpenAI: {e}")
        return "Lo siento, hubo un error al conectar con la IA.", 0

def sanitize_context(text):
    """
    Filtra posibles correos electrónicos, contraseñas, URLs e IPs 
    antes de enviarlos al modelo de lenguaje.
    """
    if not text:
        return text
    
    # 1. Censurar correos electrónicos
    text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', '[CORREO_CENSURADO]', text)
    
    # 2. Censurar posibles contraseñas (heurística básica con palabras clave)
    text = re.sub(r'(?i)(contraseña|password|clave|credencial|token)[\s:=]+[^\s\n,]+', r'\1: [CENSURADO]', text)
    
    # 3. Censurar direcciones IP (IPv4)
    text = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', '[IP_CENSURADA]', text)
    
    return text

def procesar_mensaje(telefono, mensaje_usuario):
    """
    Controlador principal del Chatbot.
    Versión Pública RAG.
    """
    # 0. Limpieza y Normalización
    user_msg_lower = mensaje_usuario.strip().lower()
    print(f"Mensaje recibido: '{user_msg_lower}' de {telefono}")

    # 1. RAG (Público)
    institutional_context = search_knowledge_base(mensaje_usuario)
    safe_context = sanitize_context(institutional_context) # Censura PRE-LLM
    
    # 2. Generar Respuesta
    final_context = (
        f"CONTEXTO PROPORCIONADO:\n{safe_context}\n"
        f"--------------------------------------------------\n"
        f"INSTRUCCIONES DE SEGURIDAD IMPORTANTES:\n"
        f"1. Eres un asistente oficial de la UAGRM. Responde basándote estrictamente en el contexto.\n"
        f"2. BAJO NINGUNA CIRCUNSTANCIA debes revelar contraseñas, correos electrónicos, IPs internas, o credenciales que puedan haberse filtrado. Si un estudiante te pide esos datos, responde: 'Por políticas de seguridad de la UAGRM, no tengo permitido proporcionar esos datos sensibles.'\n"
        f"3. Si la pregunta no está en el contexto, responde genéricamente cómo usar el bot o que no tienes esa información."
    )

    return get_openai_response(mensaje_usuario, final_context)