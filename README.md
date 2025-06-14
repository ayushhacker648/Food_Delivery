# 🍔 Foodie - Full Stack Food Ordering App

**Foodie** is a full-featured food ordering web application where users can browse restaurants, explore menus, place orders, and manage their profile. Built using modern technologies: **React (Vite)** for the frontend and **Node.js/Express + MongoDB** for the backend.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React (with Vite)
- 💨 Tailwind CSS
- 🔄 Axios
- 🧭 React Router
- 📦 Lucide-react icons

### Backend
- 🚀 Node.js + Express.js
- 🗄️ MongoDB + Mongoose
- 🔐 JWT Authentication
- 🌐 CORS

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/foodie.git
cd foodie
2. Backend Setup
bash
Copy
Edit
cd backend
npm install

Start the backend server:
bash
Copy
Edit
npm run dev
3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
npm run dev

🔐 Environment & Security
Environment variables are securely stored in .env and excluded using .gitignore.

Authentication uses JWT tokens for secure session management.

Use tools like dotenv and helmet for added backend security.

🔄 API Endpoints (Sample)
Auth
POST /api/register – Register user

POST /api/login – Login user

Menu
GET /api/foods – List all menu items

POST /api/foods – Create a new food item (Admin)

Orders
POST /api/orders – Place an order

GET /api/orders/:userId – Get user's orders

🧪 Future Improvements
Add payment gateway (e.g., Razorpay or Stripe)

Admin dashboard with order management

Live order tracking (socket.io)

Rating & reviews system

