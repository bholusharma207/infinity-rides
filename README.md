# 🏍️ Infinity Rides – Full-Stack eCommerce

Premium motorcycle riding gear eCommerce platform built with React + Tailwind CSS + Node.js + Express + MongoDB.

---

## 🚀 Quick Start

### 1. Setup MongoDB
- Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free account
- Create a **free M0 cluster**
- Click **Connect → Drivers** → Copy the connection string
- Paste it into `backend/.env` as `MONGO_URI`

### 2. Configure Environment
```bash
# Edit backend/.env and fill in:
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key      # Optional - demo mode works without it
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Install & Run Backend
```bash
cd backend
npm install        # Already done if you followed setup
npm run seed       # Seeds admin user + 12 sample products
npm run dev        # Starts on http://localhost:5000
```

### 4. Install & Run Frontend
```bash
cd frontend
npm install        # Already done if you followed setup
npm run dev        # Starts on http://localhost:5173
```

### 5. Login Credentials
- **Admin**: admin@infinityrides.com / Admin@12345
- **User**: Sign up from the website

---

## 📁 Project Structure

```
infinty/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Header, Footer, ProductCard, Spinner
│   │   ├── context/      # AuthContext, CartContext
│   │   ├── pages/        # Home, Products, Cart, Checkout, Admin...
│   │   ├── utils/        # API wrapper, helpers
│   │   └── App.jsx       # Root with React Router
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB
│   ├── config/        # Database connection
│   ├── controllers/   # Auth, Product, Cart, Order, Admin, Payment
│   ├── middleware/     # JWT auth, admin guard, error handler, upload
│   ├── models/        # User, Product, Cart, Order
│   ├── routes/        # API route definitions
│   ├── scripts/       # Database seeder
│   └── server.js
│
└── README.md
```

---

## ✨ Features

### User Side
- 🏠 Homepage with hero banner + featured products
- 🛒 Product listing with filters (category, sort, search)
- 📦 Product detail page with images, sizes, colors
- 🛍️ Cart with quantity controls + order summary
- 💳 Checkout with address form + Razorpay payment
- 🔐 JWT authentication (signup/login/logout)
- 📋 Order history + profile management

### Admin Panel
- 📊 Dashboard with revenue/orders/users stats
- 📦 Product CRUD with image upload
- 📋 Order management with status updates
- 👥 User management with block/unblock

### Tech & Security
- 🔒 bcrypt password hashing
- 🛡️ JWT + role-based access control
- 🔄 Inventory-safe payments (stock deducted after payment)
- 📱 Fully responsive (mobile + desktop)
- 🎨 Premium dark theme with glassmorphism effects

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Railway)
- Set environment variables in the hosting dashboard
- Use `npm start` as the start command
