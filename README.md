  Proyecto: Aplicación Fullstack

Proyecto: Aplicación Fullstack
==============================

Este proyecto es una aplicación fullstack que utiliza **Prisma** para la gestión de la base de datos y **npm** para la ejecución de la parte frontend. A continuación, se detallan los pasos para configurar y ejecutar el proyecto correctamente.

Requisitos previos
------------------

Asegúrate de tener instalados los siguientes componentes:

*   **Node.js (versión LTS recomendada)**
*   **npm (se instala junto con Node.js)**
*   **Prisma (se instala automáticamente con `npx` en los comandos indicados)**

Instrucciones de instalación y ejecución
----------------------------------------

### 1\. Instalación de dependencias

Primero, debes instalar las dependencias necesarias para el frontend. Para ello:

    cd frontend
    npm install
        

### 2\. Configuración de variables de entorno

Dentro de la carpeta `frontend`, debes crear un archivo `.env` con las siguientes variables de entorno:

    SESSION_SECRET=tu_secreto_muy_largo_y_aleatorio_aqui
    DATABASE_URL="file:./prisma/dev.db"
        

### 3\. Creación y configuración de la base de datos

Para inicializar la base de datos usando Prisma, sigue estos pasos:

1.  Navega a la carpeta `prisma` que está dentro de `frontend`:
    
        cd frontend/prisma
                    
    
2.  Ejecuta los siguientes comandos para crear y generar las migraciones de la base de datos:
    *   Crear la base de datos:
        
            npx prisma db push
                                
        
    *   Generar el cliente Prisma:
        
            npx prisma generate
                                
        

### 4\. Ejecución del proyecto

Después de haber configurado la base de datos y generado el cliente Prisma, puedes iniciar el proyecto:

    cd ../
    npm run dev
        

Notas adicionales
-----------------

*   Asegúrate de tener un `SESSION_SECRET` seguro y único para cada entorno.
*   La URL de la base de datos en el archivo `.env` está configurada para una base de datos SQLite local (`dev.db`), asegúrate de adaptarla según sea necesario para entornos de producción.

* * *

¡Listo! Si has seguido todos los pasos, tu aplicación debería estar corriendo correctamente en el entorno de desarrollo.