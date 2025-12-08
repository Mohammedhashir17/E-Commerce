import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../../payment/razorpay.js';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../db-operations/models/Order.js';

const router = express.Router();

router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount provided' });
    }

    const order = await createRazorpayOrder(amount);
    res.json(order);
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment order' });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (isValid) {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
        };
        order.paymentStatus = 'paid';
        await order.save();
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

