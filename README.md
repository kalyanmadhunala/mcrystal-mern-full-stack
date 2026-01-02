# 🏺 M Crystal – MERN Full-Stack E-commerce Platform (Detailed Guide)

A **production-grade MERN stack e-commerce application** built for selling premium **Marble & Ceramic decor products**, featuring authentication, admin management, secure payments, PDF invoice generation, and cloud-optimized media delivery.

---

## 🌐 Live Links

- **User Website:** https://mcrystalz.web.app  
- **Admin Panel:** https://mcrystalz-admin.web.app  
- **Backend API:** https://mcrystal-mern-full-stack.onrender.com  

---

## ✨ Features Overview

### 👤 User
- Email & Google OAuth authentication
- Product browsing, search & collections
- Cart & address management
- Multiple saved addresses with default selection
- Secure checkout (COD / Razorpay / Stripe)
- Orders & invoice PDF downloads
- Fully responsive UI

### 🛠 Admin
- Secure admin authentication
- Product, category & collection management
- Order & user management
- Protected admin routes

### ⚙️ Platform
- MERN stack architecture
- JWT authentication (HTTP-only cookies)
- Cloudinary image optimization
- Playwright-based PDF invoice generation
- Firebase Hosting (Frontend & Admin)
- Render hosting (Backend)

---

## 🧱 Tech Stack

### Frontend / Admin
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Firebase Hosting
- Cloudinary

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Google OAuth
- Razorpay & Stripe
- Playwright
- Nodemailer

---

## 📁 Project Structure

```
mcrystal-mern-full-stack/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── src/
│
├── admin/
│   └── src/
│
└── README.md
```

---



## 🚀 Local Development Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/kalyanmadhunala/mcrystal-mern-full-stack.git
cd mcrystal-mern-full-stack
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run server
```

Server runs on: `http://localhost:10000`

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

### 4️⃣ Admin Setup
```bash
cd admin
npm install
npm run dev
```

---

## 📦 Deployment Guide

### 🔹 Backend (Render)
1. Create a **Web Service** on Render
2. Root directory: `backend`
3. Build command:
```bash
npm install
```
4. Start command:
```bash
npm start
```
5. Add environment variables in Render dashboard
6. Deploy

---

### 🔹 Frontend & Admin (Firebase Hosting – Manual)

```bash
npm install -g firebase-tools
firebase login
```

Inside `frontend/` or `admin/`:

```bash
firebase init hosting
npm run build
firebase deploy --only hosting
```

---

## 🧾 Invoice PDF Generation

- Implemented using **Playwright**
- HTML → PDF rendering
- Auto-named invoices
- Cloud-deploy safe (no browser issues)

---

## 🖼 Image Optimization

- Images stored on Cloudinary
- Optimized via URL transforms:
  - `f_auto`
  - `q_auto`
  - Responsive sizing
- Faster load times & better UX

---

## 🔒 Security

- HTTP-only cookies for JWT
- OAuth secure redirect handling
- Role-based access control
- Secrets stored only in backend

---

## 📌 Future Enhancements

- Profile Dashboard
- Email invoice automation
- Wishlist management
- Analytics dashboard
- Multi-language support
- PWA support
- CI/CD pipelines

---

## 👨‍💻 Author

**Kalyan Madhunala**  
GitHub: https://github.com/kalyanmadhunala

---

## ⭐ Support

If you like this project:
- ⭐ Star the repo
- 🐛 Report issues
- 🤝 Submit PRs

---

### 🏁 Final Note

This project demonstrates **real-world MERN architecture**, production deployment, and modern best practices.
