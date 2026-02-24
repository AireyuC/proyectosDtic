# Sistema UAGRM Bot (Backend)

Este repositorio contiene la lógica del lado del servidor del bot institucional automatizado (RAG), basado en **Django, PostgreSQL (pgvector) y LlamaParse**.

## 📖 Documentación

Toda la documentación arquitectónica, técnica y de despliegue ha sido unificada y movida a la carpeta `/docs` en la raíz genérica del proyecto estructurado, o en el nivel de organización base para tener todo en un solo lugar.

Por favor dirigirse a:

➡️ **[Directorio de Documentación Principal](../docs/01_Backend_Arquitectura_y_Estructura.md)**  
Allí encontrarás la arquitectura de módulos, configuraciones asíncronas de Docker y las instrucciones de desarrollo.

*(Nota: Archivos legacy como ESTRUCTURA_BACKEND.md y README extensos fueron consolidados)*.

## 🚀 Despliegue Rápido
```bash
# Variables
cp .env.example .env

# Contenedores
docker-compose up -d --build
```
