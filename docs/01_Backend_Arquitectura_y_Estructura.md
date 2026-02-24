# Arquitectura y Estructura del Backend (UAGRM Bot)

Este documento describe la organización de carpetas, código y arquitectura del backend basado en Django, diseñado para el procesamiento y atención de consultas institucionales vía WhatsApp (mediante N8N) y una API para el frontend administrativo.

## 🛠 Tech Stack Core
- **Framework**: Django + Django REST Framework.
- **Base de Datos**: PostgreSQL con soporte vectorial (`pgvector`).
- **Orquestación**: Docker + Docker Compose.
- **AI/LLM**: GPT-4o-mini (OpenAI), LlamaParse (Ingesta RAG).

---

## 📂 Árbol de Directorios del Backend

La arquitectura sigue un modelo modular basado en (Domain Driven Design ligero) organizando cada dominio en `apps/`.

```text
uagrm_bot_backend/
├── 📂 apps/                  # Módulos principales de la aplicación
│   ├── 📂 authentication/    # Gestión de usuarios, roles, tokens y claves API
│   ├── 📂 chatbot/           # Sistema RAG público y Webhooks de consulta general
│   ├── 📂 institutional/     # Pipeline de ingesta de documentos (LlamaParse, Chunks, PGVector)
│   ├── 📂 massive_messaging/ # Lógica para el envío de mensajes masivos vía WhatsApp
│   ├── 📂 messaging/         # Componentes generales de mensajería
│   └── 📂 simulation/        # [Legacy] Mock API para simulación del sistema académico
│
├── 📂 config/                # Configuración global de Django (settings, urls, wsgi/asgi)
├── 📂 core/                  # Vistas base y utilidades compartidas entre apps
├── 📂 templates/             # Plantillas HTML (usadas mínimamente)
├── 📂 utils/                 # Excepciones custom, helpers y utilidades
│
├── .env                      # Variables de entorno críticas
├── docker-compose.yml        # Orquestación (App Web + Postgres)
├── Dockerfile                # Imagen Docker de la App Django
├── manage.py                 # CLI de Django
└── requirements.txt          # Dependencias (incluye llama-index, django, etc.)
```

---

## 🏢 Arquitectura Interna de las Aplicaciones (`apps/`)

En las últimas versiones, el proyecto fue refactorizado para estandarizar el contenido de cada app bajo el patrón:
- `api/`: Vistas (Views, ViewSets), Rutas (`urls.py`) y Serializers.
- `models/`: Definición de modelos de base de datos (con `__init__.py` para registrarlos).
- `services/`: Lógica de negocio pesada, llamadas a APIs externas y procesamiento de datos.

### 🔐 1. Authentication
Maneja la seguridad del sistema administrativo y el acceso de APIs públicas.
- **Roles y Permisos**: `Admin`, `Verifier`, `Uploader`. Usados por el frontend para mostrar las interfaces correspondientes.
- **Endpoints**: Login de usuarios administrativos y manejo de Tokens.
- **API Key**: Validación de acceso para servicios externos (como el Webhook de N8N).

### 🤖 2. Chatbot (Core RAG System)
Es el cerebro del asistente para atención pública. Funciona de manera stateless (sin estado complejo de usuario), identificando hilos de conversación de WhatsApp.
- **`services/ai_handler.py`**: Orquestador principal (Input -> Retrieval -> LLM -> Output).
- **`services/knowledge_retriever.py`**: Motor de búsqueda de similitud sobre `PGVector`.
- **`models/ChatHistory`**: Almacena el historial por Session ID (teléfono) para mantener contexto y no requerir login del usuario final.
- **Acceso Público**: Se asegura que el bot solo devuelva información de chunks indexados con `access_level='public'`.

### 📚 3. Institutional
Pipeline asíncrono para convertir PDFs en base de conocimiento.
- **`services/ingestion.py`**: Envia PDFs a `LlamaParse`, recibe Markdown, fragmenta el texto (Chunking), extrae embeddings de OpenAI y los guarda en base de datos.
- **`models/UploadedDocument`**: PDF subido al sistema.
- **`models/DocumentChunk`**: Cada párrafo/sección indexada lista para consultas RAG.

### 📢 4. Massive Messaging (Nuevo)
Módulo encargado de automatizar el envío de mensajes masivos (broadcasts) a listas de contactos.
- Gestiona la estructura JSON requerida y la distribución temporal de mensajes para evitar baneos o bloqueos por rate-limit de la API de Meta.

---

## ⚙️ Despliegue Rápido (Docker)

Todo el proyecto está dockerizado para asegurar la paridad entre desarrollo y producción.

1. Configurar variables de entorno (copiar `.env.example` a `.env`):
   - `OPENAI_API_KEY`, detalles estructurados de la DB (`POSTGRES_DB`, etc), Claves secretas de Django.
2. Levantar los contenedores:
   ```bash
   docker-compose up -d --build
   ```
3. Ejecutar migraciones:
   ```bash
   docker-compose exec web python manage.py migrate
   ```
4. Crear superusuario (Opcional):
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

El Swagger y la interfaz administrativa de Django estarán disponibles para interactuar.
