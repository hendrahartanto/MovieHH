<div align="center">
  <img src=".\frontend\src\assets\moviehh_logo.png" alt="MovieHH Banner" width="30%" />
  
  <p><strong>A Modern Full-Stack Movie Reservation & Management System</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Redis-Caching_&_Queues-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/TanStack_Query-State-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
    <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/BullMQ-Jobs-000000?style=flat-square" alt="BullMQ" />
    <img src="https://img.shields.io/badge/Midtrans-Payments-034789?style=flat-square" alt="Midtrans" />
  </p>
</div>

---

## 📖 Overview

**MovieHH** is a comprehensive, full-stack movie reservation platform designed to handle complex business logic, concurrent seat bookings, and seamless payment processing. Built with a robust modern tech stack, this project demonstrates advanced architectural patterns including real-time web sockets, background job processing, and scalable database design.

> I use this project to explore modern software architecture and engineering best practices and learn how to structure a **large-scale full-stack application** using a feature-based architecture, scalable folder organization, reusable components, clean business logic, and maintainable backend services.
>
> Throughout this project, I experimented with technologies such as React, Express, PostgreSQL, Prisma, Redis, Tanstack Query, Midtrans payment gateway integration, BullMQ, and Socket.io to better understand how production-ready applications are designed.

---

## ✨ Key Features

### For Users

- **Dynamic Browsing:** Browse movies by genre, view detailed descriptions, and check available showtimes.
- **Interactive Seat Reservation:** Visual seat selection with real-time availability updates to prevent double-booking.
- **Secure Payment Integration:** Integrated with **Midtrans Payment Gateway** for seamless and secure transaction processing.
- **Digital Ticketing:** Automatic generation of digital tickets complete with scannable QR codes upon successful payment.
- **Account Management:** Secure user authentication (JWT) with options to view and cancel upcoming reservations.

### For Admin

- **Comprehensive Dashboard:** Gain insights into total reservations, system capacity, and revenue analytics.
- **Content Management:** Full CRUD capabilities for managing movies, genres, and complex showtime scheduling.
- **Role-Based Access Control:** Secure promotion and management of administrative users.

### Technical Highlights

- **Real-time Concurrency:** Utilizes **Socket.io** to lock seats dynamically as users select them, preventing race conditions during high-traffic booking windows.
- **Reliable Background Processing:** Leverages **BullMQ and Redis** to handle asynchronous tasks such as generating tickets, sending confirmation emails, and automatically timing out abandoned seat reservations.
- **Data Integrity:** Strict input validation and sanitization using **Zod** across both the frontend forms and backend API endpoints.

---

## 🛠️ Tech Stack

### Frontend

- **Core:** React 19, TypeScript, Vite
- **Styling & UI:** Tailwind CSS v4, Shadcn UI, `lucide-react` (icons)
- **State Management:**
  - Server State: React Query (`@tanstack/react-query`)
  - Client State: Zustand
- **Forms & Validation:** React Hook Form + Zod resolvers

### Backend

- **Core:** Node.js, Express, TypeScript
- **Database & ORM:** PostgreSQL managed via Prisma ORM
- **Caching & Queues:** Redis, BullMQ
- **Security & Auth:** bcryptjs, jsonwebtoken (JWT), Helmet, Rate Limiting
- **Real-time & Integrations:** Socket.io, Midtrans Client, Pino (structured logging)

---

## 📐 Architecture & System Design

To ensure reliability and high performance, MovieHH implements several advanced architectural patterns:

1. **Seat Locking Mechanism:** When a user selects a seat, a Socket.io event is emitted to lock the seat temporarily. This state is broadcasted to all connected clients viewing the same showtime, providing a real-time collaborative booking experience.
2. **Background Jobs (BullMQ):**
   - **Reservation Timeouts:** When a booking process starts, a delayed job is added to the queue. If payment isn't completed within the time limit, the job releases the locked seats back to the available pool.
   - **Ticket Processing:** Heavy tasks like generating QR codes and finalizing ticket records are offloaded to background workers to keep API response times lightning fast.
3. **Monorepo Structure:** Separation of concerns with dedicated `/frontend` and `/backend` directories, sharing TypeScript definitions where applicable.

---

## 💻 Set up (Local Demo)

You can easily run a local demo of the entire stack using Docker Compose.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hendrahartanto/MovieHH.git
   cd MovieHH
   ```

2. **Start the Application:**
   Ensure Docker is running, then spin up the entire stack (Database, Cache, Backend, and Frontend) with a single command:

   ```bash
   docker-compose up -d
   ```

   _Note: The backend container automatically handles database migrations and initial seeding on startup._

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`. The API will be available at `http://localhost:3000`.

---

## 📸 Screenshots

#### Home
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/84288c56-f2ca-49ca-82f0-e89f32956706" />

#### Movie
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/24726f52-76fd-495f-8452-af5f9c8b8c2a" />

#### Seat Selector
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/d2bede97-4488-4c31-a1d7-5ff54893411a" />

#### Midtrans Payment
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c2b07bc1-d522-4d7b-aae6-be028a82adf9" />

#### Admin Dashboard
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/dba7d5c6-f32e-4cfb-9ba0-01f3d89bcc4b" />

---
