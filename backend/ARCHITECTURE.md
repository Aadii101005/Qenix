# System Architecture

# Overview
The application follows a standard Client-Server architecture.

## 1. Frontend (Next.js)
App Router: Used for file-based routing.
Context API: Manages global authentication state.
Axios Interceptors: Automatically attaches JWT tokens to outgoing requests.
TailwindCSS: Used for a clean, modern UI.

## 2. Backend (NestJS)
Modular Design: Features are separated into Auth and Tasks modules.
Services: Contains all business logic.
Controllers: Handles HTTP requests and responses.
Guards: Protects dashboard routes using JWT Strategy.

## 3. Database (MongoDB)
Mongoose: Provides an Object Data Modeling (ODM) layer.
Schemas: Defined for both Users and Tasks.
Relationships: Tasks are linked to Users via `userId`.

## Authentication Flow
1. User provides email/password.
2. Backend validates and signs a JWT.
3. Frontend stores JWT in `localStorage`.
4. JWT is sent in the `Authorization` header for all subsequents requests.
