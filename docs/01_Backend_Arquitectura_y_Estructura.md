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
│   └── 📂 messaging/         # Componentes generales de mensajería
│
├── 📂 config/                # Configuración global de Django (settings, urls, wsgi/asgi)
├── 📂 core/                  # Vistas base y utilidades compartidas entre apps
├── 📂 templates/             # Plantillas HTML (usadas mínimamente)
├── 📂 utils/                 # Excepciones custom, helpers y utilidades
│
├── .env                      # Variables de entorno críticas
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
- **Modelos de Prueba (Mocks)**: Para probar la distribución y colas de envío sin integrarse todavía a la DB real de la universidad, el módulo incluye modelos de simulación (`MockFaculty`, `MockCareer`, `MockStudent`). 
  - Puedes inyectar datos falsos ejecutando: `docker-compose exec backend python manage.py seed_mocks`
  - Esto poblará la base con 3 Facultades, 6 Carreras y 60 estudiantes ficticios listos para recibir Broadcasts de prueba.

  CUIDADO
  Si vas a enviar mensajes masivos ten en cuenta que tienes que modificcar los numeros de telefonos que estan registrados en los mocks de prueba, porque si no le entregaras mensajes a personas que no quieres

---

## ⚙️ Despliegue Rápido (Docker)

Todo el ecosistema (Backend, Frontend, N8N, Postgres y servicios adicionales) está dockerizado y orquestado desde la raíz del proyecto. El archivo `docker-compose.yml` general incluye:
- Backend (Django)
- Frontend (React)
- Postgres (con extensión pgvector)
- Redis (Message Broker)
- Celery Worker (Tareas asíncronas)
- N8N (Flujos y Webhooks)

1. **Configurar el archivo `.env`:** En el directorio contenedor del backend, debes crear un archivo `.env` (o copiar desde `.env.example`) y definir las claves de las APIs necesarias. Además, puedes reconfigurar a tu gusto los datos para la conexión a la base de datos:

   ```env
   OPENAI_API_KEY= (Puedes adquirir una api key con el administrador model="gpt-4o-mini")
   LLAMA_CLOUD_API_KEY= (Puedes iniciar sesion y generear una api key https://cloud.llamaindex.ai/)

   # Puedes reconfigurar estos datos a gusto para tu base de datos
   DB_NAME=uagrm_bot_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=db
   DB_PORT=5432
   DEBUG=True
   ```

2. Desde la raíz superior del proyecto (`/`), levantar los contenedores:
   ```bash
   docker-compose up -d --build
   ```
3. Ejecutar migraciones en el contenedor web (Backend):
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
4. Crear superusuario (Opcional):
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

El Swagger y la interfaz administrativa de Django estarán disponibles para interactuar.
