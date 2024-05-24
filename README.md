<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nest/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```
5. Clonar el archivo ```.env.template``` y renombrar a ```.env```

6. Llenar las variables de entorno definidas en el archivo ```.env ```
7. Ejecutar la aplicacion en dev:
```
yarn start:dev
```
   
8. Reconstruir la base de datos con la semilla (para desarrollo)
  ```
  http://localhost:3000/api/v2/seed
  ```

## Stack utilizado para la aplicación 
* MongoDB
* NestJS


# Dockerización

## Producción

1. Crear el archivo ```.env.prod ```
2. Llenar las variables de entorno de producción.
3. Crear la nueva imagen
* Build & Run (Solo la primera vez para crear el contenedor de app y de la BD)
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build
```

4. Run (si la imagen ya está creada)
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```

## Nota
Por defecto, docker-compose usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```
docker-compose -f docker-compose.prod.yaml up --build
```
No seria necesario cargar un archivo ```.env.prod``` con las variables de entorno de producción por aparte