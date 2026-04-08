# 🛒 Shopolio – E-commerce Backend API

Shopolio is a scalable and production-ready **E-commerce Backend API** built using **Node.js, Express, and MongoDB**. It provides core functionalities required for an online shopping platform including authentication, product management, and order processing.

---
## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login & signup
  - Role-based access control (User/Admin)

- 📦 **Product Management**
  - Create, Read, Update, Delete products
  - Pagination, filtering & sorting

- 🛒 **Order Management**
  - Create orders
  - View order history
  - Update order status (Admin)

- 📄 **API Documentation**
  - Integrated Swagger UI
  - Test APIs directly from browser

- ⚙️ **Production-Ready Setup**
  - Environment-based configuration
  - Clean architecture (MVC)
  - Centralized error handling

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (MongoDB Atlas)  
- **Authentication:** JWT + Bcrypt  
- **API Docs:** Swagger (OpenAPI 3.0)  

---

## 📁 Project Structure

```
Shopolio
├── configs/        # Config files (Swagger, DB, etc.)
├── controllers/    # Business logic
├── middlewares/    # Auth & error handling
├── models/         # Mongoose schemas
├── routes/         # API routes
├── docs/           # Swagger schemas
└── server.js       # Entry point
```
---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

git clone https://github.com/GeekyHim/Shopolio.git
cd Shopolio


---

### 2️⃣ Install dependencies

npm install


---
### 3️⃣ Create `.env` file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
SWAGGER_ENABLED=true


---

### 4️⃣ Run the server

npm start


---
## 🌐 API Documentation (Swagger)

Once the server is running:

http://localhost:5000/api-docs

Test all APIs directly using Swagger UI.


---
## 🔑 API Endpoints Overview

### Auth
POST /api/v1/auth/signup  
POST /api/v1/auth/login  

### Products
GET /api/v1/products  
POST /api/v1/products (Admin)  
PATCH /api/v1/products/:id  
DELETE /api/v1/products/:id  

### Orders
POST /api/v1/orders  
GET /api/v1/orders  
GET /api/v1/orders/:orderId  
PATCH /api/v1/orders/:orderId/status (Admin)  


---
## 🔐 Authentication

Protected routes require:

Authorization: Bearer <JWT_TOKEN>


---
## 🚀 Deployment & Swagger Docs:

https://shopolio.onrender.com/


---
## 🧠 Key Highlights

- Clean and scalable architecture (MVC)
- Production-ready backend design
- Real-world API structure
- Fully documented APIs (Swagger)


---

## 📌 Future Improvements

- Payment gateway integration 
- Redis caching
- Rate limiting & security enhancements
- Unit & integration testing


---

## 👨‍💻 Author

Himanshu Gupta  
GitHub: https://github.com/GeekyHim  
LinkedIn: https://www.linkedin.com/in/geekyhim/


---
## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!