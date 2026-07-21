# ☕ Cafe Manager

A full-stack Cafe Management System to manage categories, products, orders, and bills with role-based access for admin and users.

---

## 🛠️ Tech Stack

**Frontend:** Angular, TypeScript, Angular Material, SCSS

**Backend:** Node.js, Express.js, MySQL, EJS

---

## 📁 Project Structure

```
cafe-manager/
├── backend/       # Node.js + Express REST API
└── frontend/      # Angular application
```

---

## ✨ Features

- 🔐 JWT Authentication (Login, Signup, Forgot Password)
- 👤 Role-based access — Admin & User
- 📦 Category & Product Management
- 🧾 Bill generation with PDF export
- 📊 Admin Dashboard with stats
- 🔄 Change Password & Logout

---

## 🚀 Setup

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

### Environment Variables — `backend/.env`
```
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cafe_manager
JWT_SECRET=your_secret
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/category/get | Get all categories |
| POST | /api/category/add | Add category |
| GET | /api/product/get | Get all products |
| POST | /api/product/add | Add product |
| POST | /api/bill/generateReport | Generate bill PDF |

---

## 👨‍💻 Author

**Hariom Patel** — [GitHub](https://github.com/HariomPatel2002) · [LinkedIn]([https://linkedin.com/in/hariom-patel](https://www.linkedin.com/in/hariom-patel-74b0b124a/))
