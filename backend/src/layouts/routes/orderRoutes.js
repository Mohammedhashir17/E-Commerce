import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from '../service/orderService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const order = await createOrder(req.user._id, shippingAddress, paymentMethod);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const orders = await getUserOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id, req.user._id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await updateOrderToPaid(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/:id/deliver', protect, async (req, res) => {
  try {
    const order = await updateOrderToDelivered(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    // Only admins can access all orders
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const Order = (await import('../db-operations/models/Order.js')).default;
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

