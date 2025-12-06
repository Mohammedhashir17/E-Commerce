import { sendOTPEmail } from './emailService.js';

// OTP service with email and mobile sending
const otpStore = new Map(); // In-memory store (use Redis in production)
const mobileOtpStore = new Map(); // Separate store for mobile OTPs

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const sendOTP = async (email, otp, purpose = 'login') => {
  // Store OTP with expiration (5 minutes)
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    purpose,
  });

  // Send OTP via email
  await sendOTPEmail(email, otp, purpose);

  return true;
};

export const sendOTPToMobile = async (mobileNumber, otp, purpose = 'reset-password') => {
  // Store OTP with expiration (5 minutes)
  mobileOtpStore.set(mobileNumber, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    purpose,
  });

  // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
  // For now, log to console
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📱 OTP SMS (Not Sent - SMS Not Configured)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`To: ${mobileNumber}`);
  console.log(`Purpose: ${purpose === 'reset-password' ? 'Password Reset' : purpose}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Expires in: 5 minutes`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  return true;
};

export const verifyOTP = (email, otp) => {
  const stored = otpStore.get(email);
  
  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP expired' };
  }

  if (stored.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }

  // OTP verified, remove it
  otpStore.delete(email);
  return { valid: true, message: 'OTP verified' };
};

export const verifyMobileOTP = (mobileNumber, otp) => {
  const stored = mobileOtpStore.get(mobileNumber);
  
  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiresAt) {
    mobileOtpStore.delete(mobileNumber);
    return { valid: false, message: 'OTP expired' };
  }

  if (stored.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }

  // OTP verified, remove it
  mobileOtpStore.delete(mobileNumber);
  return { valid: true, message: 'OTP verified' };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isGmail = (email) => {
  return email.toLowerCase().endsWith('@gmail.com');
};

