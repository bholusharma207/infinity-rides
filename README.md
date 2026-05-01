# 🏍️ Infinity Rides – Premium Motorcycle Gear

![Infinity Rides](https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80)

Infinity Rides is a premium full-stack e-commerce platform designed for the fearless Indian rider. We offer high-quality, certified motorcycle riding accessories including helmets, jackets, gloves, boots, and safety guards.

## ✨ Features

- **Premium Biker UI**: Dark-themed, high-contrast design with smooth animations.
- **Product Catalog**: Easy browsing with category filters and sorting (Price, Rating, Newest).
- **Secure Authentication**: JWT-based login and signup system.
- **Shopping Cart**: Real-time cart management with local and server-side persistence.
- **Admin Dashboard**: Comprehensive management of products, orders, and users.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Razorpay Integration**: Secure payment gateway for seamless checkout.

## 🛠️ Technology Stack

### Frontend
- **React 19**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router 7** (Navigation)
- **React Icons** & **React Hot Toast**

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT** (Authentication)
- **Multer** (File Uploads)
- **Razorpay** (Payments)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)
- Razorpay API Keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bholusharma207/infinity-rides.git
   cd infinity-rides
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file and add VITE_API_URL=http://localhost:5000
   npm run dev
   ```

## 📦 Deployment

### Backend (Render)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Environment Variable**: `VITE_API_URL` (Point to your Render URL)

---

Developed with ❤️ for the Biking Community.
