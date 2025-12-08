import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from '../service/orderService.js';
import { protect } from '../middleware/authMiddleware.js';
<<<<<<< HEAD
import { generateProductInvoice, generateOrderInvoice } from '../service/invoiceService.js';
=======
>>>>>>> d2173165bf9146200c6b469ea37f398582504076

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

// IMPORTANT: /all route must come before /:id route to avoid route conflict
router.get('/all', protect, async (req, res) => {
  try {
    // Only admins can access all orders
    if (req.user.role !== 'admin') {
      console.log('Access denied - User role:', req.user.role, 'User ID:', req.user._id);
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    const Order = (await import('../db-operations/models/Order.js')).default;
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders for admin`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// Invoice download routes - must come before /:id route to avoid route conflict
router.get('/:id/invoice/:productIndex', protect, async (req, res) => {
  try {
    // Only admins can download invoices
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const orderId = req.params.id;
    const productIndex = parseInt(req.params.productIndex);

    if (isNaN(productIndex)) {
      return res.status(400).json({ message: 'Invalid product index' });
    }

    const pdfBuffer = await generateProductInvoice(orderId, productIndex);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${orderId}-${productIndex}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/invoice', protect, async (req, res) => {
  try {
    // Only admins can download invoices
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const orderId = req.params.id;
    const pdfBuffer = await generateOrderInvoice(orderId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${orderId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: error.message });
  }
});

// Public route for barcode scanning - format: INV-{orderId}-{productIndex}
router.get('/scan/:barcode', async (req, res) => {
  try {
    const barcode = req.params.barcode;
    
    // Parse barcode format: INV-{orderId}-{productIndex}
    // MongoDB ObjectIds are 24 hex characters, so we can safely split by '-'
    if (!barcode.startsWith('INV-')) {
      return res.status(400).json({ message: 'Invalid barcode format' });
    }
    
    const parts = barcode.split('-');
    if (parts.length !== 3) {
      return res.status(400).json({ message: 'Invalid barcode format' });
    }
    
    const orderId = parts[1]; // Order ID (MongoDB ObjectId, 24 hex chars)
    const productIndex = parseInt(parts[2]);
    
    if (isNaN(productIndex)) {
      return res.status(400).json({ message: 'Invalid product index in barcode' });
    }

    const pdfBuffer = await generateProductInvoice(orderId, productIndex);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${orderId}-${productIndex}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice from barcode:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    // Prevent "all" and "scan" from being treated as an ID
    if (req.params.id === 'all' || req.params.id === 'scan') {
=======
router.get('/:id', protect, async (req, res) => {
  try {
    // Prevent "all" from being treated as an ID
    if (req.params.id === 'all') {
>>>>>>> d2173165bf9146200c6b469ea37f398582504076
      return res.status(404).json({ message: 'Order not found' });
    }
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

export default router;

