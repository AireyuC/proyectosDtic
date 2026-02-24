# Arquitectura y Estructura del Frontend (UAGRM Bot)

El frontend es el panel administrativo e interfaz web adicional del sistema UAGRM Bot, construido bajo un esquema de "Feature-Based Architecture" para garantizar aislamiento de componentes y una escalabilidad sólida conforme el backend crece.

## 🛠 Tech Stack Core
- **Framework**: React 18 + Vite + TypeScript.
- **Estado/Data**: Axios (HTTP Client con interceptores) + React Context para Autenticación.
- **Estilos y UI**: Tailwind CSS puro + Iconos con `lucide-react`.
- **Ruteo**: React Router v6.

---

## 📂 Árbol de Directorios del Frontend

Los archivos residen bajo `src/`, organizados jerárquicamente:

```text
uagrm_bot_frontend/
├── 📂 public/                # Archivos estáticos accesibles directamente
├── 📂 src/
│   ├── 📂 assets/            # Imágenes, logotipos
│   ├── 📂 components/        # Componentes Reutilizables y Globales
│   │   ├── ProtectedRoute.tsx # 🛡️ Bloquea rutas basándose en roles de usuario
│   │   └── TestChatBubble.tsx # 💬 Widget flotante para testear el bot en vivo
│   │
│   ├── 📂 config/            
│   │   └── axios.ts          # Cliente HTTP global (inyecta JWT/Bearer Token)
│   │
│   ├── 📂 features/          # Dominio Céntrico de la App
│   │   ├── 📂 auth/          # Servicios y tipos de validación (authService, Login Types)
│   │   └── 📂 chat/          # Servicios y utilidades de consumo del RAG (chatService)
│   │
│   ├── 📂 hooks/             
│   │   └── useAuth.ts        # Context hook para determinar el rol del usuario logueado en cualquier vista
│   │
│   ├── 📂 layouts/
│   │   └── DashboardLayout.tsx # Sidebars y Navbar adaptables a pantallas grandes (Full Width Layout)
│   │
│   ├── 📂 pages/             # Vistas por Ruta
│   │   ├── Login.tsx         # Pantalla principal de Acceso
│   │   ├── PublicChat.tsx    # Demo o Landing Page
│   │   ├── Unauthorized.tsx  # Pantalla de Acceso Denegado (Error 403)
│   │   │
│   │   ├── 📂 admin/         # Vistas: Módulo de Superusuarios / Creación de Cuentas
│   │   ├── 📂 uploader/      # Vistas: Subida e ingesta de documentos LlamaParse
│   │   └── 📂 verifier/      # Vistas: Validar la correctitud o estado de procesamiento PDF
│   │
│   ├── App.tsx               # Orquestación general de Rutas (Públicas y Privadas)
│   ├── main.tsx              # React Entrypoint
│   └── index.css             # Archivo central de Tailwind
│
├── .env                      # Variables Vite (Ej: VITE_API_URL=http://localhost:8000)
├── vite.config.ts            # Configuración general de Vite
└── package.json              # Dependencias (npm)
```

---

## 🔐 Seguridad, Roles y Flujo de Trabajo (RBAC)

El sistema soporta Role-Based Access Control (RBAC) inyectado nativamente por el Backend Django en la respuesta del Login.

1. **Flujo de Acceso**:
   - Usuario ingresa credenciales en `/login`.
   - Backend devuelve un token (almacenado en `localStorage`) y la lista de `groups` pertenecientes al usuario.
   - El cliente de Axios intercepta cada llamado a la API posteriormente y añade el header `Authorization: Token ...`.

2. **Control Ruteado (`ProtectedRoute`)**:
   - Cada ruta sensible está envuelta por `<ProtectedRoute allowedRoles={['Rol_Name']} />`.
   - Redirige inteligéntemente a `Unauthorized.tsx` si el rol no coindice, o al login si la sesión caducó.

3. **Roles Operativos**:
   - **Admin**: Acceso incondicional, creación de otros usuarios, visualización de uso global.
   - **Verifier**: Encargado de corroborar la ingesta del motor de Vectores y evaluar pruebas de calidad vía `TestChatBubble`.
   - **Uploader**: Empleados limitados únicamente a cargar archivos institucionales (PDFs/Docs) sin poder alterar estados sistémicos.

---

## 📐 Decisiones de Diseño
- **Disposición Full Width**: Se ha refactorizado el sistema para abandonar el `max-width` en vistas principales, ocupando el 100% de la pantalla para aprovechar el espacio en los Dashboards complejos y tablas de inventario/documentos.
- **Desarrollo Ágil sin Compliques**: Al inyectar el token globalmente desde Axios, cualquier fetch interno dentro de `/features/` o `/pages/` se desentiende de la logística de los tokens, permitiendo centrarse en UI/UX pura.
