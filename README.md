# Prisma + PostgreSQL + Bun - CRUD API

Este proyecto es una API sencilla de gestión de usuarios usando Prisma, PostgreSQL y Bun. Incluye un CRUD completo (Create, Read, Update, Delete) con validación de datos.

---

## 🚀 Guía de Configuración Paso a Paso

### 1. Preparar el archivo de variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores (por defecto ya están configurados para el desarrollo local):

```env
# PostgreSQL Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=prisma_db

# Database URL (used by Prisma)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma_db?schema=public"

# Server Port
PORT=3000
```

### 2. Levantar la base de datos con Docker Compose

Inicia el contenedor de PostgreSQL:

```bash
docker compose up -d db
```

Verifica que esté corriendo:

```bash
docker compose ps
```

Revisa los logs si necesitas:

```bash
docker compose logs -f db
```

### 3. Instalar dependencias

```bash
bun install
```

### 4. Generar el cliente de Prisma

```bash
bunx prisma generate
```

### 5. Aplicar las migraciones a la base de datos

Crea la migración inicial y aplícala:

```bash
bunx prisma migrate dev --name init
```

Si quieres sincronizar sin crear una migración (solo en desarrollo):

```bash
bunx prisma db push
```

### 6. (Opcional) Abrir Prisma Studio

Para ver y modificar los datos de forma visual:

```bash
bunx prisma studio
```

### 7. Iniciar el servidor

```bash
bun run src/server.ts
```

Verás el mensaje:
```
Elysia is running on http://localhost:3000
```

---

## 📚 Esquema de la Base de Datos

El modelo `User` contiene los siguientes campos:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   (hasheada con Bun.password)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔌 Endpoints de la API - CRUD Completo

La API está disponible en `http://localhost:3000` y proporciona los siguientes endpoints:

### 1. **Crear un usuario** (POST)

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "password": "miPassword123"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "data": {
    "id": "user_abc123",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Validaciones:**
- Email debe ser válido
- Nombre debe tener mínimo 2 caracteres
- Contraseña debe tener mínimo 8 caracteres

---

### 2. **Obtener todos los usuarios** (GET)

```bash
curl http://localhost:3000/users
```

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "user_abc123",
      "email": "juan@example.com",
      "name": "Juan Pérez",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

> **Nota:** La contraseña NO se devuelve en las respuestas GET por seguridad.

---

### 3. **Obtener un usuario por ID** (GET)

```bash
curl http://localhost:3000/users/user_abc123
```

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "id": "user_abc123",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Si el usuario no existe (404):**
```json
{
  "ok": false,
  "message": "Usuario no encontrado"
}
```

---

### 4. **Actualizar un usuario** (PATCH)

Puedes actualizar uno o varios campos:

```bash
curl -X PATCH http://localhost:3000/users/user_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com"
  }'
```

También puedes cambiar solo la contraseña:

```bash
curl -X PATCH http://localhost:3000/users/user_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "password": "nuevaPassword456"
  }'
```

**Respuesta:**
```json
{
  "ok": true,
  "user": {
    "id": "user_abc123",
    "email": "juancarlos@example.com",
    "name": "Juan Carlos Pérez",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T11:45:00Z"
  }
}
```

---

### 5. **Eliminar un usuario** (DELETE)

```bash
curl -X DELETE http://localhost:3000/users/user_abc123
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": {
    "id": "user_abc123",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T11:45:00Z"
  }
}
```

---

## 📋 Flujo Completo de Ejemplo

### 1. Crear 2 usuarios

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@example.com", "name": "María García", "password": "securePass123"}'

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "pedro@example.com", "name": "Pedro López", "password": "anotherPass456"}'
```

### 2. Listar todos los usuarios

```bash
curl http://localhost:3000/users
```

### 3. Obtener un usuario específico

```bash
# Reemplaza user_abc123 con un ID real de la respuesta anterior
curl http://localhost:3000/users/user_abc123
```

### 4. Actualizar un usuario

```bash
curl -X PATCH http://localhost:3000/users/user_abc123 \
  -H "Content-Type: application/json" \
  -d '{"name": "María González García"}'
```

### 5. Eliminar un usuario

```bash
curl -X DELETE http://localhost:3000/users/user_abc123
```

### 6. Verificar que fue eliminado

```bash
curl http://localhost:3000/users
```

---

## 🗄️ Stack Tecnológico

- **Backend:** Bun + Elysia
- **Base de datos:** PostgreSQL en Docker
- **ORM:** Prisma
- **Validación:** Elysia Built-in Validators
- **Seguridad:** Bun.password para hash de contraseñas

---

## 📁 Estructura del Proyecto

```
project-01/
├── prisma/
│   ├── schema.prisma           # Definición del modelo User
│   └── migrations/             # Carpeta de migraciones
├── src/
│   ├── server.ts               # Punto de entrada del servidor
│   ├── db/
│   │   └── prisma.ts           # Instancia de Prisma Client
│   └── modules/
│       └── users/
│           ├── routes.ts       # Rutas y handlers del CRUD
│           └── schemas.ts      # Esquemas de validación
├── .env.example                # Plantilla de variables de entorno
├── .env                        # Variables de entorno (local)
├── compose.yml                 # Configuración de Docker
├── package.json                # Dependencias
└── README.md                   # Esta guía
```

---

## 🛠️ Solución de Problemas

**Error: "Cannot connect to database"**
- Verifica que Docker esté corriendo: `docker ps`
- Revisa que el contenedor de PostgreSQL esté activo: `docker compose ps`
- Asegúrate de que la `DATABASE_URL` es correcta en `.env`

**Error: "Column not found"**
- Ejecuta las migraciones: `bunx prisma migrate dev --name init`
- O sincroniza: `bunx prisma db push`

**Error: "Port 3000 already in use"**
- Cambia el puerto en `.env`: `PORT=3001`
- O termina el proceso que usa el puerto: `lsof -i :3000`

---

## 📖 Recursos Útiles

- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Documentación de Elysia](https://elysiajs.com/)
- [Documentación de Bun](https://bun.sh/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
