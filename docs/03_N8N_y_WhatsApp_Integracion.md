# Guía Técnica: Configuración de n8n y WhatsApp API

Este documento contiene el manual principal de integración y orquestación de flujos (Webhooks, Mensajes y Campañas) operando la pasarela de Meta (WhatsApp API v24.0) mediada por N8N.

## 🏗️ 1. Preparación de Meta (Facebook Developers)

Debido a su naturaleza productiva, n8n es simplemente un Middleware de paso. Meta requiere:
1.  Un **Portafolio Comercial** (Business Portfolio) en [developers.facebook.com](https://developers.facebook.com).
2.  Una **Aplicación Activa (Tipo Empresa)**.
3.  **Token de Acceso Permanente (Recomendado)**: Configurar y utilizar un Token de acceso permanente vinculado directamente a tu Número de Teléfono (Phone Number ID). Esto libera de la carga de renovar tokens frecuentemente y es más óptimo e intuitivo a largo plazo para las unidades y administradores.
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

## ⚠️ 5. Estado Actual y Desafíos a Producción (Go-To-Production)

Actualmente, la integración de Meta y N8N se encuentra operando bajo el modo **"Solo para Pruebas"** con un número telefónico de test. Para transicionar ordenadamente a un entorno 100% productivo sin cortes en el servicio, existen desafíos de verificación y facturación que deben resolverse.

### 5.1. El Problema de los Tokens Temporales
El uso actual de "Tokens Temporales" (generados manualmente en el panel de Meta) presenta un problema crítico: **caducan de forma predeterminada cada 24 horas** o tras un periodo corto de inactividad, lo que corta repentinamente la operatividad del Bot a nivel de API.
- **La Solución**: Configurar el **Token de Acceso Permanente**. Se hace en Meta Business Manager > Creando un "Usuario del Sistema" y asignándole permisos totales (`whatsapp_business_messaging`, `whatsapp_business_management`). *Si el bot responde correctamente hoy y mañana falla sin motivo de código en N8N, casi seguro que es por la expiración de este Token.*

(No es necesario hacer los pasos la creacion de Usuario del Sistema, porque ya esta configurado y se puede utilizar el token permanente al igual que se puede actualizar en Usuario del Sistema)

### 5.2. Verificación Empresarial (Meta Business Verification)
Para salir de "Solo Pruebas" y eliminar la advertencia global, Meta requiere certificar la autenticidad de la universidad para abrir las cuotas escalables de envío (`Trust Levels / Tiers`).
- **Requisitos de Verificación**: Subir documentación legal respaldatoria (NIT, Licencia de Funcionamiento, Factura de luz/teléfono) que coincida *exactamente* con el "Business Name", la Dirección y el Teléfono registrado en Meta.
- **Tiers de Confianza y Límites de Envío**:
  - **Tier 0 (Sin Verificar)**: Límite estricto y bloqueable de **250 clientes únicos** por cada 24 horas (exclusivo a mensajes masivos o iniciados por la institución).
  - **Tier 1 (Verificado)**: El límite escala instantáneamente a **1,000 - 2,000 clientes únicos** por 24 horas.
  - El sistema automatizado de WhatsApp te escala a Tier 2 (10,000) o Tier 3 (100,000) con el tiempo si mantienes un índice de calidad Verde/Bueno (bajos bloqueos de usuarios).

> [!NOTE]
> Estos límites rígidos **solo aplican a mensajes iniciados por la universidad**. Si un estudiante nos escribe primero (soporte normal en RAG), esos mensajes carecen de un límite Tier perjudicial.

### 5.3. Modelo de Costo y Mensajes Gratuitos
A diferencia de la app casual de WhatsApp, la Cloud API oficial de Meta requiere **obligatoriamente añadir una Tarjeta de Crédito** válida a la cuenta publicitaria o portafolio comercial, incluso para poder hacer uso exclusivo de lo gratuito.
- **Conversaciones de Servicio (Gratuitas)**: Todas las conversaciones iniciadas por los usuarios (estudiantes abriéndole chat al Bot) abren una **Ventana de 24 horas de Soporte al Cliente**. Todos los mensajes libres que el Bot reciba y envíe dentro de esa ventana de 24 horas son **100% gratuitos y no se descuentan de la factura**. La ventana se resetea a 24 horas frescas en cada mensaje entrante del usuario.
- **Conversaciones Iniciadas por Empresa (Custo Activo)**: Enviar alertas por la vía `massive_messaging` (fuera de la ventana de 24 horas del usuario) inicia su propia ventana de conversación que si entra al Billing y tiene fracción de costo de centavo en categorías como **Marketing** o **Utilidad**. Todo esto depende de los balances de la zona (Bolivia) que debes buscar en la tabla de cotización Meta.

### 5.4. Uso Mandatorio de Plantillas (Message Templates)
El control definitivo anti-spam de Meta es el sistema interno de Plantillas. Una vez que se pasa la verificación empresarial y la estructura masiva entra en juego: 
- El envío de notificaciones automáticas/masivas no puede enviarse con un texto libre tradicional si el usuario lleva más de 24h sin contestar.
- **Plantillas Pre-aprobadas**: Es necesario crear Plantillas de Mensajes a la medida en el WhatsApp Manager (`Categoría Utilidad` o `Marketing`). Meta suele demorar de 2 minutos a 2 horas en aprobar el formato (revisando faltas ortográficas o intenciones turbias). Una vez estado aprobado, en n8n usaremos la API invocando explícitamente el nombre en duro de la plantilla junto con las "variables de cuerpo" (Ej. `Hello {{1}}`).
