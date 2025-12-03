import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../service/wishlistService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const wishlist = await getWishlist(req.user._id);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await addToWishlist(req.user._id, productId);
    res.json(wishlist);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete('/:productId', protect, async (req, res) => {
  try {
    const wishlist = await removeFromWishlist(req.user._id, req.params.productId);
    res.json(wishlist);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;

