import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './layouts/db-operations/db-connection.js';

import authRoutes from './layouts/routes/authRoutes.js';
import productRoutes from './layouts/routes/productRoutes.js';
import cartRoutes from './layouts/routes/cartRoutes.js';
import wishlistRoutes from './layouts/routes/wishlistRoutes.js';
import orderRoutes from './layouts/routes/orderRoutes.js';
import paymentRoutes from './layouts/routes/paymentRoutes.js';

dotenv.config();

// Verify Razorpay configuration on startup
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  console.log('✅ Razorpay API keys loaded successfully');
} else {
  console.warn('⚠️  Warning: Razorpay API keys not found in .env file');
  console.warn('   Payment gateway will not work until keys are configured.');
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'ZUKA API is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

