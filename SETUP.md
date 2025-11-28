# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (for payment integration)

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://root:amh%400203@e-commerce.felcyk3.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Important**: Replace `@` in password with `%40` in MongoDB URI.

Start backend:
```bash
npm start
# or
npm run dev
```

Seed database (optional):
```bash
npm run seed
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the Application

1. Register a new user at `/login`
2. Browse products at `/products`
3. Add items to cart
4. Add items to wishlist
5. Proceed to checkout
6. Complete payment (test mode)

## Razorpay Setup

1. Sign up at https://razorpay.com
2. Get your Key ID and Key Secret from Dashboard
3. Add them to `.env` file
4. For testing, use Razorpay test keys

## Troubleshooting

### MongoDB Connection Issues
- Ensure password is URL encoded (`@` → `%40`)
- Check network access in MongoDB Atlas
- Verify database name in connection string

### CORS Issues
- Backend CORS is configured for `localhost:3000`
- Update CORS settings in `server.js` for production

### Payment Issues
- Ensure Razorpay keys are correct
- Check Razorpay script is loaded in browser
- Verify order amount is in paise (amount * 100)

## Next Steps

1. Add real product images to `frontend/src/components/images/`
2. Configure Razorpay webhook for payment verification
3. Add email notifications
4. Deploy to production

