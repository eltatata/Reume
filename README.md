# Reume - Backend

<img width="727" height="777" alt="image" src="https://github.com/user-attachments/assets/0a3000dc-cdc8-46b8-bee6-05c5275bd850" />

This repository contains the **backend of Reume**, built with **Node.js, Express, and TypeScript** following the principles of **Clean Architecture**.  
The backend handles business logic related to users, roles, and schedules, while integrating best practices for development, testing, and deployment.

---

## 🚀 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **Docker**
- **Swagger** (API documentation)
- **Jest** + **Supertest** (testing)
- **Winston** + **Morgan** (logging)
- **GitHub Actions** (CI/CD pipelines)
- **Husky** + **ESLint** (pre-commit validations & linting)
- **Resend** + **Mailtrap** (email providers)
- **AWS ECS / EC2 / App Runner / Render** (deployment)

---

## 📌 Core Features

### 👥 Users & Roles
- Full CRUD for users.  
- Role-based access control:  
  - `ADMIN`: can manage all users and view/manage schedules from any user.  
  - `USER`: restricted to managing only their own schedules.  

### 📅 Schedules
- Full CRUD for user schedules.  
- Automatic calculation of available time slots.  

### 🔐 Authentication & Security
- User registration with **OTP email verification**.  
- OTP verification also applies when changing user email.  

### 📧 Email Providers
- **Factory Pattern** implementation for switching email providers between **Resend** and **Mailtrap** via environment variables.  

---

## 🏗️ Architecture

The project follows **Clean Architecture**, ensuring clear separation of concerns, scalability, and testability.

---

## 🧪 Testing

- **Unit testing** with **Jest**.  
- **Integration testing** with **Supertest**.  

---

## 🛠️ CI/CD & Best Practices

- Fully **Dockerized** for deployment on:
  - AWS EC2
  - AWS App Runner
  - Render
- **GitHub Actions** configured for CI/CD pipelines.  
- **Husky** Git hooks:
  - `pre-commit`: runs **ESLint** globally.  
  - `pre-push`: validates that the Docker image builds successfully.  
- **ESLint** + **Prettier** for consistent code style.
- **Git Flow** workflow followed for branching and release management.

---

## 📚 API Documentation

The API includes robust, auto-generated documentation with **Swagger**.  

---

## ⚡ Installation & Usage

You can run the backend either with **Docker** or with **Node.js** locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/reume-backend.git
cd reume-backend
```

### 2. Running with Docker (recommended)
```bash
docker compose up -d
```

### 3. Running locally with Node.js
```bash
npm install
npm run start
```

## 🎯 Project Purpose
This project was built with the goal of learning and applying best practices, including:
- Clean Architecture & design patterns (Factory, separation of concerns).
- Testing at unit and integration levels.
- CI/CD automation with GitHub Actions.
- Logging and structured API documentation.
