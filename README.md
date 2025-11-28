# E-Commerce MERN Stack Application

A complete e-commerce application built with React, Material UI, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication** - Login/Register with JWT
- **Product Management** - Browse products with category and price filtering
- **Shopping Cart** - Add/remove items, persistent cart with localStorage
- **Wishlist** - Save favorite products
- **Order Management** - Place orders and track order history
- **Payment Integration** - Razorpay payment gateway
- **Responsive Design** - Material UI components with custom theme

## 📁 Project Structure

```
e-commerce/
├── frontend/
│   └── src/
│       ├── layouts/          # Full pages (Login, Home, Product Page, Cart, etc.)
│       ├── services/        # backend-service.js - All API calls
│       ├── components/      # Reusable components
│       │   ├── ui/         # Buttons, navbars, cards, dialogs
│       │   └── images/     # Organized by page
│       └── App.js
│
├── backend/
│   └── src/
│       ├── layouts/
│       │   ├── routes/     # All Express routes
│       │   ├── service/    # API handlers (business logic)
│       │   └── db-operations/  # MongoDB models, URL connection
│       ├── payment/        # Payment gateway integration
│       └── server.js
```

## 🎨 Color Theme

- **Primary**: #835DC2
- **Secondary**: #F4F2FF
- **Accent**: #DDD6FE

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://root:amh%400203@e-commerce.felcyk3.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Important**: If your MongoDB password contains special characters like `@`, you must URL encode them:
- `@` becomes `%40`
- Example: `amh@0203` becomes `amh%400203` in the connection string

4. Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Products
- `GET /api/v1/products` - Get all products (with filters)
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/category/:category` - Get products by category
- `GET /api/v1/products/categories` - Get all categories

### Cart
- `GET /api/v1/cart` - Get user cart (protected)
- `POST /api/v1/cart/add` - Add item to cart (protected)
- `PUT /api/v1/cart/:itemId` - Update cart item (protected)
- `DELETE /api/v1/cart/:itemId` - Remove item from cart (protected)

### Wishlist
- `GET /api/v1/wishlist` - Get user wishlist (protected)
- `POST /api/v1/wishlist/add` - Add to wishlist (protected)
- `DELETE /api/v1/wishlist/:productId` - Remove from wishlist (protected)

### Orders
- `POST /api/v1/orders` - Create order (protected)
- `GET /api/v1/orders` - Get user orders (protected)
- `GET /api/v1/orders/:id` - Get order by ID (protected)

### Payment
- `POST /api/v1/payment/create-order` - Create Razorpay order (protected)
- `POST /api/v1/payment/verify` - Verify payment (protected)

## 🔐 Environment Variables

Make sure to set up the following environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

## 🗄️ Database Models

- **User** - User authentication and profile
- **Product** - Product information
- **Category** - Product categories
- **Cart** - Shopping cart items
- **Wishlist** - User wishlist
- **Order** - Order information

## 🎯 Features Implementation

- ✅ Hero banner with offers
- ✅ Category filtering
- ✅ Price filtering
- ✅ Product listing and detail pages
- ✅ Add to Cart functionality
- ✅ Add to Wishlist functionality
- ✅ Login/Register pages
- ✅ Navbar with all navigation links
- ✅ Persistent cart (localStorage for guests, database for users)
- ✅ Protected routes for checkout
- ✅ Checkout page
- ✅ Payment integration (Razorpay)
- ✅ Order history

## 📦 Dependencies

### Backend
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- razorpay
- express-validator

### Frontend
- react
- react-dom
- react-router-dom
- @mui/material
- @mui/icons-material
- axios
- vite

## 🚀 Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The backend can be deployed to services like Heroku, Railway, or AWS.
3. Update the API_BASE_URL in `frontend/src/services/backend-service.js` for production.

## 📄 License

This project is open source and available under the MIT License.

