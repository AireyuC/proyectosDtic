# Guía Técnica: Configuración de n8n y WhatsApp API

Este documento contiene el manual principal de integración y orquestación de flujos (Webhooks, Mensajes y Campañas) operando la pasarela de Meta (WhatsApp API v24.0) mediada por N8N.

## 🏗️ 1. Preparación de Meta (Facebook Developers)

Debido a su naturaleza productiva, n8n es simplemente un Middleware de paso. Meta requiere:
1.  Un **Portafolio Comercial** (Business Portfolio) en [developers.facebook.com](https://developers.facebook.com).
2.  Una **Aplicación Activa (Tipo Empresa)**.
3.  Token de Acceso Permanente asociado a un Número de Teléfono (Phone Number ID).
4.  Suscribir el Webhook a los eventos de `messages` apuntando a la URL del flujo N8N expuesta en Internet.

## 🔄 2. Flujo Principal (Recepción RAG)

Este es el proceso por defecto para responder mensajes tipo "Chatbot" usando RAG.

1.  **Webhook Node**: Recibe un `POST` de Meta con cada interacción de un usuario (texto, reaccón, etc). Responde a la API inyectando el body a los pasos siguientes.
2.  **Respond to Webhook**: N8N responde con código **200 OK** a Meta inmediatamente. Esto es vital para evitar el *Timeout Penalty* de Facebook (si no respondes, dejan de enviar mensajes webhooks durante un tiempo).
3.  **If Node (Filtro)**: Filtra para asegurar de que procesamos el evento correcto (e.g. validamos que el texto exista en el JSON, ignoramos *read-receipts*, etc).
4.  **Request a Backend Django**:
    N8N hace un request `POST` hacia la red en Docker (URL: `http://web:8000/api/chat/post/`).
    Manda únicamente:
    -   `message`: El texto decodificado.
    -   `phone`: El número de origen.
5.  **Envío a WhatsApp API**:
    El flujo recibe de Django la respuesta RAG limpia, y hace un `POST Request` a: `https://graph.facebook.com/v24.0/[PHONE_ID]/messages`
    Con el Header: `Authorization: Bearer <TOKEN META>`.

## 📢 3. Flujos de Envío Masivo (Broadcast)

Implementado para distribuir avisos masivos sin intervención humana uno a uno.

### Desafíos y Consideraciones JSON
Al procesar mensajes masivos que contienen caracteres especiales (saltos de línea funcionales `\n`, símbolos o links de WhatsApp) es mandatorio tratar el campo de envío correctamente en el HTTP Node Request de n8n para evitar el error: **"JSON parameter needs to be valid JSON"**.

**Prácticas Recomendadas para N8N HTTP Request en Masivos:**
-   Evitar usar *"Specify Body: Using JSON"* cuando el cuerpo de texto es dinámico, prefiriendo *"Using Fields Below"* con Data Expressions, o en su defecto construyendo el objeto JSON completamente dentro de un bloque **Code Node** o **Set Node** antes del HTTP Node y pasándolo serializado.
-   Escapar los saltos de línea (Newlines) correctamente o utilizar strings delimitadas especiales en las funciones de pre-procesamiento de N8N (`$json.body.replace(/\n/g, "\\n")`).

### Distribución Controlada (Anti-Spam)
-   Se utiliza el concepto de **Batches o Colas** implementadas del lado de Django (`apps/massive_messaging`), regulando la cantidad máxima de solicitudes emitidas por segundo o por minuto hacia n8n, o haciendo que el flujo N8N despache mediante ciclos `Loop` integrados que previenen bloqueos de Rate-Limit de la API pública de Meta (límite base de *mensajes iniciados por empresa*).

## 🚀 4. Mantenimiento y Backup de Flujos

-   **Exportar:** En el Canvas de n8n, usar los 3 puntos superiores -> `Download` (Export Workflow). Esto genera un `.json` local (Ej. `My_workflow_N8N.json` que reside en la raíz).
-   **Seguridad:** Nunca publicar ese archivo crudo de `.json` a ramas públicas git sin antes vaciar/desconectar las credenciales que lo acompañan o limpiar el token en duro si se utilizó.
