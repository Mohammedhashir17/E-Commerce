import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../service/cartService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const cart = await getCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await addToCart(req.user._id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await updateCartItem(req.user._id, req.params.itemId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await removeFromCart(req.user._id, req.params.itemId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete('/', protect, async (req, res) => {
  try {
    const cart = await clearCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;

