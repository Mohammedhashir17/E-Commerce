import User from '../db-operations/models/User.js';
import jwt from 'jsonwebtoken';
import { validateEmail, isGmail, sendOTP, verifyOTP, generateOTP } from './otpService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const sendOTPForLogin = async (email) => {
  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Check if it's Gmail
  if (!isGmail(email)) {
    throw new Error('Please use a Gmail account');
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found. Please register first.');
  }

  // Generate and send OTP
  const otp = generateOTP();
  await sendOTP(email, otp);

  return { message: 'OTP sent to your email' };
};

export const verifyOTPAndLogin = async (email, otp) => {
  // Verify OTP
  const verification = verifyOTP(email, otp);
  if (!verification.valid) {
    throw new Error(verification.message);
  }

  // Get user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

export const sendOTPForRegister = async (email) => {
  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Check if it's Gmail
  if (!isGmail(email)) {
    throw new Error('Please use a Gmail account');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists. Please login instead.');
  }

  // Generate and send OTP
  const otp = generateOTP();
  await sendOTP(email, otp);

  return { message: 'OTP sent to your email' };
};

export const verifyOTPAndRegister = async (userData, otp) => {
  const { name, email, password } = userData;

  // Verify OTP
  const verification = verifyOTP(email, otp);
  if (!verification.valid) {
    throw new Error(verification.message);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid user data');
  }
};

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Validate email
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!isGmail(email)) {
    throw new Error('Please use a Gmail account');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid user data');
  }
};

export const loginUser = async (email, password) => {
  // Validate email
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!isGmail(email)) {
    throw new Error('Please use a Gmail account');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

