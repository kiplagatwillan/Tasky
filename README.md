# ✅ Tasky - Your Personal Task Manager

**Tasky** is a full-stack web application that empowers users to efficiently manage daily tasks with ease. It offers a clean, intuitive interface and robust functionality including user authentication, task organization, profile customization, and responsive design. Built with modern technologies like React, Node.js, TypeScript, PostgreSQL, and Material-UI, Tasky is designed for performance, scalability, and productivity.

---

## ✨ Features

### 🔐 User Authentication
- Secure registration, login, and logout.
- Strong password validation using [`zxcvbn`](https://github.com/dropbox/zxcvbn).

### 🗂️ Task Management
- **Create**: Add tasks with a title and optional description.
- **Read**: View tasks in categorized views:
  - Active Tasks
  - Completed Tasks
  - Trash (soft-deleted)
- **Update**: Edit task title and description.
- **Toggle**: Mark tasks as complete/incomplete.
- **Delete**:
  - Soft Delete (move to trash)
  - Permanent Delete (from trash)
- **Restore**: Move tasks back from trash to active state.

### 👤 User Profile
- View and update personal information (name, username, email).
- Change account password.
- Upload a profile picture (avatar).

### 💻 Responsive Frontend
- Built using **Material-UI (MUI)** for a sleek, modern design.
- Fully responsive and mobile-friendly.

### 🧩 Architecture
- Fully separated **frontend** and **backend** for maintainability and scalability.

---

## 🚀 Technologies Used

### 🔙 Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database access layer
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT-based authentication
- **multer** - File uploads
- **zxcvbn** - Password strength estimation
- **dotenv** - Environment configuration
- **cors** - Cross-Origin Resource Sharing

### 🖥️ Frontend
- **React** - UI framework
- **Vite** - Fast frontend build tool
- **TypeScript** - For type-safe component development
- **Material-UI (MUI)** - UI component library
- **axios** - API communication
- **react-router-dom** - Client-side routing
- **jwt-decode** - Decode JWT tokens in the browser

### 🗃️ Database
- **PostgreSQL** - Used to store user and task data

### ☁️ Deployment
- **Render** - Hosting backend & PostgreSQL
- **Vercel** - Hosting frontend

---

## ⚙️ Setup Instructions

### 📦 Prerequisites
Make sure the following are installed on your system:
- Node.js (v18+)
- npm or yarn
- PostgreSQL
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kiplagatwillan/Tasky.git
cd Tasky
