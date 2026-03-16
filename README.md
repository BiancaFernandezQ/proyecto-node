# Proyecto Backend Node

API REST construida con Node.js, Express y Sequelize.

## Requisitos

- Node.js 18 o superior
- npm
- PostgreSQL accesible ( ya sea en local o remoto)

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raíz del proyecto con este contenido:

```env
PORT=3000

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_DATABASE=nombre_base_de_datos
DB_DIALECT=postgres
DB_USE_SSL=false

BCRYPT_SALT_ROUNDS=10
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_SECOND=3600
```

## Correr el proyecto

- Modo desarrollo:

```bash
npm run start-dev
```

- Modo produccion:

```bash
npm start
```