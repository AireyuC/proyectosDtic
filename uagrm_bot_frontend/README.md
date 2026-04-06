# Sistema UAGRM Bot (Frontend)

Este repositorio contiene el panel de administración, la interfaz en React + Vite, y las herramientas de validación para moderadores y administradores del sistema.

## 📖 Documentación

Toda la documentación completa, flujos (Login, Autenticación, Roles) y detalles de diseño y Layout han sido centralizadas para un consumo más unificado.

Por favor dirigirse a:

➡️ **[Directorio de Documentación Principal](../docs/02_Frontend_Arquitectura_y_Estructura.md)**  

Allí encontrarás la metodología Feature-Based implementada, y el manejo del cliente Axios.

*(Nota: Archivos legacy como ESTRUCTURA_FRONTEND.md y documentación estática de Vite fueron reemplazadas y consolidadas).*

## 🚀 Desarrollo Rápido

El despliegue y validación del frontend están completamente orquestados por Docker, por lo que no es necesario correr `npm run dev` localmente si se utiliza el stack estándar.

```bash
# Navegar a la raíz del repositorio
cd ../

# Hacer build o levantar de nuevo la infraestructura general que incluye al Frontend
docker-compose up -d --build
```

*(El contenedor expone el servicio Frontend automáticamente de manera correcta)*
