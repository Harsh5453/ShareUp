# 🔄 ShareUp — Peer-to-Peer Rental Platform

> A microservices-based full-stack platform that lets users list, browse, and rent items from each other — with a full rental lifecycle, image uploads, ratings, and email notifications. 

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📌 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Microservices](#-microservices)
- [API Reference](#-api-reference)
- [Rental Lifecycle](#-rental-lifecycle)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Author](#-author)

---

## 📖 About

**ShareUp** is a full-stack peer-to-peer rental platform where users can act as **Owners** (listing items for rent) or **Borrowers** (browsing and requesting items). It features a complete rental lifecycle — from request to approval, return, and rating — backed by a Java/Spring Boot microservices architecture and a React frontend.

- 🚀 **Backend** deployed on [Render](https://render.com)
- 🌐 **Frontend** deployed on [Vercel](https://vercel.com)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login, registration, and token-based access
- 👥 **Dual Roles** — Separate Owner and Borrower dashboards with role-based access control
- 📦 **Item Management** — Owners can list items with images (Cloudinary), categories, pricing, and pickup address
- 🔍 **Browse & Filter** — Borrowers can browse and filter available items by category
- 📋 **Full Rental Lifecycle** — Request → Approve/Reject → Return (with image proof) → Return Approval
- 📧 **Email Notifications** — Gmail SMTP integration for rental status updates
- 🖼️ **Image Uploads** — Item images and return proof images via Cloudinary
- 🛡️ **Structured Exception Handling** — Clean error responses across all services
- ⚡ **Optimized DB** — Indexed queries, HikariCP connection pooling, lazy initialization

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│               React Frontend (Vercel)                   │
│         React 18 + Vite + TailwindCSS + Axios           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────────┐
│ auth-service │  │ item-service│  │  rental-service  │
│              │  │             │  │                  │
│ Spring Boot  │  │ Spring Boot │  │  Spring Boot     │
│ Spring Sec   │  │ MongoDB     │  │  MongoDB         │
│ JWT + MySQL  │  │ Cloudinary  │  │  Cloudinary      │
└──────┬───────┘  └─────────────┘  │  Gmail SMTP      │
       │                           │  → auth-service  │
       ▼                           │  → item-service  │
  ┌─────────┐                      └──────────────────┘
  │  MySQL  │ (User accounts)
  └─────────┘
       MongoDB (Items + Rentals + Ratings)
```

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Language | Java |
| Framework | Spring Boot, Spring MVC, Spring Security |
| Authentication | JWT (JSON Web Tokens) |
| Databases | MySQL (users), MongoDB (items, rentals, ratings) |
| Image Storage | Cloudinary |
| Email | Gmail SMTP (Spring Mail) |
| Build Tool | Maven |
| Containerization | Docker (Dockerfile per service) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Bundler | Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Forms | React Hook Form + Yup |
| Routing | React Router DOM v6 |
| Notifications | React Hot Toast |
| Icons | React Icons |

---

## 📦 Microservices

### 1. `auth-service`
Handles user registration, login, JWT issuance, and profile management.
- **Database:** MySQL
- **Key endpoints:** `/api/auth`, `/api/profile`
- **Security:** BCrypt password hashing, JWT filter chain

### 2. `item-service`
Manages item listings, image uploads, and item status transitions.
- **Database:** MongoDB (`items` collection)
- **Key endpoints:** `/api/items`
- **Features:** Category filtering, Cloudinary image upload, status management (`AVAILABLE` / `RENTED`)

### 3. `rental-service`
Orchestrates the full rental lifecycle, ratings, and notifications. Communicates with `auth-service` and `item-service` internally.
- **Database:** MongoDB (`rentals`, `ratings` collections)
- **Key endpoints:** `/api/rentals`
- **Features:** Borrow requests, approve/reject, return with image proof, return approval, ratings (1–10 stars)

---

## 📡 API Reference

### 🔑 Auth Service — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/auth/health` | ❌ | Health check |
| `GET` | `/api/profile` | ✅ | Get logged-in user's profile |
| `PUT` | `/api/profile` | ✅ | Update profile details |

### 📦 Item Service — `/api/items`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/items` | ❌ | Public | Browse all available items (optional `?category=`) |
| `GET` | `/api/items/{id}` | ❌ | Public | Get item details |
| `POST` | `/api/items` | ✅ | Owner | List a new item |
| `POST` | `/api/items/{id}/image` | ✅ | Owner | Upload item image to Cloudinary |
| `GET` | `/api/items/owner` | ✅ | Owner | Get owner's own item listings |
| `PUT` | `/api/items/{id}/rent` | ✅ | Internal | Mark item as rented |
| `PUT` | `/api/items/{id}/available` | ✅ | Internal | Mark item as available again |

### 🔄 Rental Service — `/api/rentals`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/rentals/request` | ✅ | Borrower | Submit a borrow request |
| `PUT` | `/api/rentals/approve/{id}` | ✅ | Owner | Approve a rental request |
| `PUT` | `/api/rentals/reject/{id}` | ✅ | Owner | Reject a rental request |
| `POST` | `/api/rentals/{id}/return` | ✅ | Borrower | Submit return with image proof |
| `PUT` | `/api/rentals/approve-return/{id}` | ✅ | Owner | Approve the return |
| `GET` | `/api/rentals/me` | ✅ | Borrower | Get borrower's rental history |
| `GET` | `/api/rentals/owner` | ✅ | Owner | Get all rental requests for owner's items |
| `GET` | `/api/rentals/owner/returns` | ✅ | Owner | Get pending return approvals |
| `GET` | `/api/rentals/{id}/return-image` | ✅ | Owner | View return proof image (redirects to Cloudinary) |

> **Auth header:** `Authorization: Bearer <token>`

---

## 🔄 Rental Lifecycle

```
Borrower                                   Owner
   │                                          │
   │──── POST /rentals/request ──────────────►│  Status: PENDING
   │                                          │
   │◄─── PUT /rentals/approve/{id} ───────────│  Status: APPROVED
   │  or PUT /rentals/reject/{id}             │  Status: REJECTED
   │                                          │
   │──── POST /rentals/{id}/return ──────────►│  Status: RETURN_REQUESTED
   │          (multipart image proof)         │
   │                                          │
   │◄─── PUT /rentals/approve-return/{id} ────│  Status: RETURN_APPROVED
   │                                          │
   │──── Rate the Owner (1-10 ⭐ + review) ──►│
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- MongoDB
- Node.js 18+ & npm
- Cloudinary account
- Gmail account (for SMTP)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shareup.git
   cd shareup
   ```

2. **Configure environment variables** for each service (see [Environment Variables](#-environment-variables))

3. **Run each service**
   ```bash
   # Auth Service
   cd auth-service
   mvn spring-boot:run

   # Item Service
   cd ../item-service
   mvn spring-boot:run

   # Rental Service
   cd ../rental-service
   mvn spring-boot:run
   ```

### Frontend Setup

```bash
cd Frontend/shareup-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### Docker (per service)

Each service has its own `Dockerfile`:
```bash
cd auth-service
docker build -t shareup-auth .
docker run -p 8080:8080 --env-file .env shareup-auth
```

---

## ⚙️ Environment Variables

### `auth-service`
```properties
PORT=8080
DATABASE_URL=jdbc:mysql://localhost:3306/shareup_auth
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
```

### `item-service`
```properties
PORT=8081
MONGODB_URI=mongodb://localhost:27017/shareup_items
JWT_SECRET=your_jwt_secret_key   # Must match auth-service
```

### `rental-service`
```properties
PORT=8082
MONGODB_URI=mongodb://localhost:27017/shareup_rentals
JWT_SECRET=your_jwt_secret_key   # Must match auth-service
AUTH_SERVICE_URL=http://localhost:8080
ITEM_SERVICE_URL=http://localhost:8081
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_app_password
```

### `Frontend/.env`
```env
VITE_AUTH_SERVICE_URL=http://localhost:8080
VITE_ITEM_SERVICE_URL=http://localhost:8081
VITE_RENTAL_SERVICE_URL=http://localhost:8082
```

---

## 👤 Author

**Harsh**
- 📧 [h664363@gmail.com](mailto:h664363@gmail.com)
- 📞 +91-9354530598
- 🔗 [LinkedIn](https://www.linkedin.com/in/harsh-92344722b/) | [GitHub](https://github.com/Harsh5453/)

---

<p align="center">Built with ☕ Java, 🍃 Spring Boot & ⚛️ React</p>
