
# 🛒 E-Commerce API

## Overview

This is a **scalable, secure, and feature-rich E-Commerce API** built with **Node.js**, **Express.js**, and **MongoDB**.
It provides complete backend functionality for managing products, users, orders, reviews, and authentication, making it ideal for integration with frontend applications or as a standalone backend service.

The API emphasizes:

* **Security** (JWT authentication, role-based access control, password hashing)
* **Performance** (optimized queries, modular design)
* **Maintainability** (clear folder structure, reusable utility functions)

---

## ✨ Features

### 👤 User & Authentication

* User registration and login
* Role-based permissions (Admin/User)
* Password hashing with **bcrypt**
* JWT-based session authentication
* Cookie storage for tokens

### 📦 Product Management

* Create, update, delete, and retrieve products
* Image upload & storage
* Filtering by category, price, and rating

### 📑 Order Management

* Create and track orders
* Update order status (Admin only)
* User order history

### ⭐ Reviews

* Add and edit reviews for products
* Calculate average rating and review count per product

### ⚠️ Error Handling

* Centralized error handler with meaningful responses
* Handles resource not found, validation errors, and authentication failures

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB + Mongoose
* **Auth:** JWT, bcrypt, cookie-parser
* **Validation:** express-validator, validator
* **File Uploads:** express-fileupload
* **Utilities:** dotenv, morgan, http-status-codes, nodemon
* **Payment (Optional/Future):** Stripe

---

## 📂 Project Structure

```
├── app.js                 # Main application entry
├── controllers/           # Business logic
├── db/                    # Database connection
├── errors/                # Custom error classes
├── middleware/            # Authentication & error handling
├── models/                # Mongoose schemas
├── public/uploads/        # Uploaded product images
├── routes/                # API endpoints
├── utils/                 # Helper functions (JWT, permissions)
└── .env.example           # Example environment variables
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

* [Node.js](https://nodejs.org/) (v14+)
* [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 2️⃣ Installation

```bash
git clone <your-repo-url>
cd e-commerce-api
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the project root:

```
MONGO_URL=mongodb://localhost:27017/ecommerce-api
JWT_SECRET=your_secret_key
JWT_LIFETIME=1d
PORT=5000
```

### 4️⃣ Run the Project

```bash
npm start
```

The API will be available at:

```
http://localhost:5000/api/v1
```

---

## 📌 Main Endpoints

### Auth & Users

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | /auth/register | Register a new user      |
| POST   | /auth/login    | Login & receive JWT      |
| GET    | /auth/logout   | Logout user              |
| GET    | /users         | Get all users (Admin)    |
| GET    | /users/showMe  | Get current user profile |

### Products

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | /products             | Get all products       |
| POST   | /products             | Create product (Admin) |
| PATCH  | /products/\:id        | Update product (Admin) |
| DELETE | /products/\:id        | Delete product (Admin) |
| POST   | /products/uploadImage | Upload product image   |

### Orders

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | /orders                 | Get all orders (Admin) |
| POST   | /orders                 | Create new order       |
| GET    | /orders/showAllMyOrders | Get user orders        |

---

## 📄 API Documentation

For detailed API request/response examples, authentication flow, and parameter descriptions, check the full Postman documentation here:

🔗 **[View API Documentation on Postman](https://documenter.getpostman.com/view/39188598/2sB3BGFUaH)**

The documentation includes:

* 📍 **Endpoint details** (method, path, description)
* 🔑 **Authentication requirements** for each route
* 📥 **Request body & parameters** examples
* 📤 **Sample responses** with status codes
* 🛠 **Error messages** and troubleshooting tips

---


