import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  sendOTPForLogin,
  verifyOTPAndLogin,
  sendOTPForRegister,
  verifyOTPAndRegister,
} from '../service/authService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// OTP-based authentication routes
router.post('/send-otp-login', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendOTPForLogin(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/verify-otp-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOTPAndLogin(email, otp);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.post('/send-otp-register', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendOTPForRegister(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/verify-otp-register', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const user = await verifyOTPAndRegister({ name, email, password }, otp);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Legacy routes (keeping for backward compatibility)
router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await getUserProfile(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;

