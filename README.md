# 🚀 Project Nexus: Team Task Manager

A professional, full-stack **MERN** application designed for high-performance team collaboration. This project integrates a robust Node.js/Express backend with a modern React frontend, featuring premium aesthetics, real-time data visualization, and secure multi-user workflows.

---

## 🏛️ System Architecture

Nexus is built on a decoupled architecture, ensuring scalability and clean separation of concerns:

- **Frontend**: A high-fidelity React 19 SPA (Single Page Application) styled with Tailwind CSS v4 and powered by Vite for lightning-fast development.
- **Backend**: A RESTful Express API following the Controller-Service-Route pattern, utilizing MongoDB Atlas for cloud-based data persistence.
- **Communication**: Secure JSON Web Token (JWT) based communication between the frontend and backend.

---

## ✨ Key Features

### 💻 Frontend (Client)
- **Glassmorphic UI**: High-end visual design with blur effects and sleek dark mode.
- **Interactive Analytics**: Project health and task distribution charts using **Recharts**.
- **Dynamic Workflows**: Smooth transitions and layout animations via **Framer Motion**.
- **Responsive Design**: Optimized for everything from mobile devices to large desktop monitors.

### ⚙️ Backend (Server)
- **Robust Authentication**: Secure registration and login with **BcryptJS** hashing.
- **API Versioning**: Scalable route structure (`/api/v1/...`).
- **Middleware Integration**: Custom error handling and authentication guards.
- **Aggregation Pipelines**: Optimized MongoDB queries for dashboard statistics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js, JWT, Morgan, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud), Mongoose ODM |
| **Tooling** | Axios, ESLint, PostCSS, Autoprefixer |

---

## 📂 Project Structure

```text
EharaAI-Assessment/
├── backend/                # Server-side Logic
│   ├── config/            # Database & Environment Config
│   ├── controllers/       # Business Logic & Request Handling
│   ├── middleware/        # JWT Auth & Error Handling
│   ├── models/            # Mongoose Data Models
│   ├── routes/            # API Endpoint Definitions
│   └── server.js          # Express Application Entry
└── frontend/               # Client-side Application
    ├── src/
    │   ├── components/    # Reusable UI Elements
    │   ├── pages/         # Page-level Components
    │   ├── context/       # Global State (Auth, Project)
    │   └── assets/        # Styles & Images
    └── vite.config.js     # Frontend Build Config
```

---

## 🚀 Combined Installation & Setup

### 1. Repository Setup
```bash
git clone <repository-url>
cd EharaAI-Assessment
```

### 2. Backend Configuration
Navigate to the backend, install dependencies, and set up your environment:
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Configuration
In a new terminal, navigate to the frontend and launch the app:
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Documentation (Summary)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate & get token | No |
| GET | `/api/projects` | List all user projects | Yes |
| POST | `/api/projects` | Create a new project | Yes |
| GET | `/api/dashboard` | Get project/task statistics | Yes |
| GET | `/api/users` | Search for team members | Yes |

---

## 📸 Interface Preview

*(Insert High-Resolution Screenshots Here)*

---

## 📜 License & Credits

Distributed under the **ISC License**.

**Developed by Parth as part of the EharaAI Technical Assessment.**
