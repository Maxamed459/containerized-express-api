# Node.js Express MongoDB Authentication API

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Containerized](https://img.shields.io/badge/Containerized-Docker_Compose-0db7ed?style=for-the-badge&logo=docker&logoColor=white)

A production-oriented REST API built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**.  
The project includes user registration, login, JWT authentication, role-based authorization, request validation, centralized error handling, and Docker support.

This backend is designed to be simple enough for beginners to understand, while still following clean backend engineering practices that are expected in real-world projects.

## Features

- User registration with hashed passwords
- User login with JWT token generation
- Protected profile route
- Admin-only users route
- Role-based access control with `admin` and `user`
- Request validation using `express-validator`
- Password hashing using `bcryptjs`
- JWT authentication using `jsonwebtoken`
- MongoDB database integration with Mongoose
- Centralized error handling middleware
- Consistent JSON API responses
- Dockerized backend and MongoDB setup
- ES Module syntax across the backend

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express | HTTP server and routing |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| express-validator | Request validation |
| Docker | Containerized application setup |
| Docker Compose | Runs backend and MongoDB together |

## Project Structure

```text
Backend/
|-- app.js
|-- config/
|   |-- config.js
|   `-- db.js
|-- controller/
|   `-- userController.js
|-- middlewares/
|   |-- authMiddleware.js
|   |-- errorMiddleware.js
|   `-- validateRequest.js
|-- model/
|   `-- user.js
|-- routes/
|   `-- userRoutes.js
|-- services/
|   `-- userService.js
|-- utils/
|   |-- apiResponse.js
|   |-- AppError.js
|   `-- jwt.js
|-- validators/
|   `-- authValidators.js
|-- Dockerfile
|-- compose.yaml
|-- package.json
`-- README.md
```

## Architecture Explanation

The project is separated into small layers so each file has a clear responsibility.

| Folder | Responsibility |
| --- | --- |
| `config/` | Loads environment variables and connects to MongoDB |
| `model/` | Defines the Mongoose user schema |
| `controller/` | Handles HTTP requests and responses |
| `services/` | Contains business logic and database operations |
| `routes/` | Defines API endpoints |
| `middlewares/` | Handles authentication, authorization, validation, and errors |
| `validators/` | Defines request validation rules |
| `utils/` | Reusable helpers for JWT, errors, and API responses |

This structure keeps the application clean, readable, and easier to scale.

## Environment Variables

Create a `.env.production` file based on `.env.production.example`.

```env
MangoUrl=mongodb://mongo_db_username:mongo_db_password@mongoDB:27017/mongo_db_database?authSource=admin
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
MONGO_INITDB_ROOT_USERNAME=mongo_db_username
MONGO_INITDB_ROOT_PASSWORD=mongo_db_password
MONGO_INITDB_DATABASE=mongo_db_database
```

For local development without Docker, `MangoUrl` can point to a local MongoDB instance:

```env
MangoUrl=mongodb://localhost:27017/backend_auth
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3000
```

## Running With Docker

This project is already Dockerized. It uses:

- `Dockerfile` to build the Node.js Express backend image
- `compose.yaml` to run both the backend and MongoDB
- a named Docker volume called `mongo-data` to persist database data
- a Docker bridge network so the backend can communicate with MongoDB

Start the full stack:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

Stop the containers:

```bash
docker compose down
```

Stop the containers and remove the MongoDB volume:

```bash
docker compose down -v
```

The backend container exposes port `3000`, so the API is available at:

```text
http://localhost:3000
```

## How Docker Works In This Project

The Docker setup contains two services.

### MongoDB Service

```yaml
mongoDB:
  image: mongo:7
```

This service runs MongoDB version 7. It loads database credentials from `.env.production` and stores database files inside the `mongo-data` Docker volume.

### Express Backend Service

```yaml
express-backend:
  build: .
  ports:
    - "3000:3000"
```

This service builds the backend from the local `Dockerfile`, installs dependencies, copies the source code, and starts the app with:

```bash
node app.js
```

The backend depends on MongoDB, and both containers are connected through the same Docker network.

## API Response Format

Successful responses follow this format:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

## API Endpoints

### Health / Welcome

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "Welcome",
  "data": null
}
```

### Register User

```http
POST /register
```

Request body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

Notes:

- `role` is optional.
- If no role is provided, the default role is `user`.
- Passwords are never stored as plain text.
- Passwords are never returned in API responses.

### Login User

```http
POST /login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes a JWT token:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "username": "john",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Get Profile

```http
GET /profile
```

Requires authentication.

Header:

```http
Authorization: Bearer jwt_token_here
```

This route returns the currently authenticated user.

### Get All Users

```http
GET /users
```

Requires authentication and `admin` role.

Header:

```http
Authorization: Bearer jwt_token_here
```

This route returns all registered users without exposing passwords.

## Authentication Flow

1. A user registers with username, email, and password.
2. The password is hashed before being saved to MongoDB.
3. The user logs in with email and password.
4. The server verifies the password.
5. The server returns a JWT token.
6. The client sends the token in the `Authorization` header.
7. Protected routes verify the token before allowing access.
8. Admin-only routes also check the user's role.

## Security Improvements

- Passwords are hashed using `bcryptjs`.
- JWT tokens are signed using a secret from environment variables.
- Protected routes require a valid Bearer token.
- Admin routes require the `admin` role.
- Validation prevents invalid request data from reaching business logic.
- Passwords are excluded from query results by default.
- Centralized error handling avoids leaking internal details.

## Example Authorization Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## Validation Rules

Registration requires:

- `username`: minimum 3 characters
- `email`: valid email format
- `password`: minimum 6 characters
- `role`: optional, must be either `admin` or `user`

Login requires:

- `email`: valid email format
- `password`: required

## HTTP Status Codes

| Status Code | Meaning |
| --- | --- |
| `200` | Request successful |
| `201` | Resource created |
| `400` | Validation error or bad request |
| `401` | Authentication required or invalid token |
| `403` | User does not have permission |
| `404` | Route or resource not found |
| `409` | Duplicate username or email |
| `500` | Internal server error |

## Useful Commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build and run with Docker:

```bash
docker compose up --build
```

View running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Stop containers:

```bash
docker compose down
```

## Job-Ready Project Summary

This project demonstrates practical backend development skills, including API design, authentication, authorization, database modeling, validation, error handling, environment configuration, and Docker-based deployment.

It shows an understanding of:

- Building REST APIs with Express
- Working with MongoDB and Mongoose
- Securing user passwords with hashing
- Implementing JWT authentication
- Protecting routes with middleware
- Applying role-based access control
- Structuring backend code for maintainability
- Running services with Docker and Docker Compose

## Future Improvements

- Add automated tests
- Add refresh tokens
- Add password reset flow
- Add rate limiting for login attempts
- Add request logging
- Add API documentation with Swagger/OpenAPI
