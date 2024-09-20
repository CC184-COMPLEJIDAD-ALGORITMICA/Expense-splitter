# Proyecto de Divisor de Gastos

## Descripción del Proyecto

Este proyecto es una aplicación web de división de gastos desarrollada utilizando el framework Remix.js. La aplicación permite a los usuarios crear grupos (llamados "juntas"), agregar gastos compartidos, y calcular cómo dividir estos gastos entre los miembros del grupo de manera equitativa.

## Algoritmos Implementados

### 1. Floyd-Warshall

El algoritmo Floyd-Warshall se utiliza en la función `equalizeMoneyButton` para optimizar las transferencias de dinero entre los participantes. Este algoritmo de programación dinámica encuentra las rutas más cortas entre todos los pares de vértices en un grafo ponderado.

#### Uso:

Se utiliza para minimizar el número de transacciones necesarias para saldar las deudas entre los participantes. El algoritmo crea una matriz de distancias (deudas) entre todos los participantes y luego itera sobre esta matriz para encontrar las rutas más eficientes para saldar deudas.

### 2. Técnicas de Recorrido en Grafos

Se utilizan técnicas de recorrido en grafos en la función `calculateDivisionsButton` para calcular los balances individuales y determinar las transferencias óptimas.

#### Uso:

Este enfoque trata a los participantes como nodos de un grafo y sus deudas como aristas. El algoritmo recorre este grafo para calcular los balances individuales y luego determina las transferencias óptimas, permitiendo manejar eficientemente las relaciones de deuda complejas entre múltiples participantes.

### 3. Programación Dinámica

La programación dinámica se aplica en ambas funciones de cálculo de divisiones:

1. En `equalizeMoneyButton`, se utiliza dentro del algoritmo Floyd-Warshall para optimizar las transferencias.
2. En `calculateDivisionsButton`, se usa para calcular eficientemente los balances acumulados de cada participante, evitando cálculos redundantes al procesar múltiples gastos.

## Justificación del Framework

Se optó por utilizar Remix.js como framework de desarrollo por las siguientes razones:

1. **Rendimiento**: Remix.js ofrece un excelente rendimiento al cargar y renderizar páginas, lo cual es crucial para una aplicación interactiva de división de gastos.

2. **Enrutamiento basado en archivos**: Simplifica la estructura del proyecto y hace que sea más fácil de mantener y escalar.

3. **Manejo de estado del servidor**: Permite manejar el estado en el servidor de manera eficiente, lo cual es útil para los cálculos complejos de división de gastos.

4. **Integración con TypeScript**: Proporciona un sólido sistema de tipos que ayuda a prevenir errores y mejora la mantenibilidad del código.

5. **Carga progresiva**: Permite cargar datos de manera progresiva, lo que mejora la experiencia del usuario al interactuar con grandes conjuntos de datos de gastos.

## Conclusión

Este proyecto demuestra la aplicación práctica de algoritmos complejos como Floyd-Warshall y técnicas de recorrido en grafos en un contexto del mundo real. La implementación en Remix.js permite una experiencia de usuario fluida y un rendimiento óptimo, mientras que el uso de TypeScript asegura la robustez y mantenibilidad del código.

SECCION COMPILACION
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
