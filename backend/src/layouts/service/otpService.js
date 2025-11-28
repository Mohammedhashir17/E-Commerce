// Simple OTP service (for development)
// In production, use a proper email service like SendGrid, AWS SES, or Nodemailer

const otpStore = new Map(); // In-memory store (use Redis in production)

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const sendOTP = async (email, otp) => {
  // Store OTP with expiration (5 minutes)
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  // In development, log the OTP (remove in production)
  console.log(`OTP for ${email}: ${otp}`);
  
  // TODO: In production, send email using SendGrid, AWS SES, or Nodemailer
  // Example with Nodemailer:
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Your OTP Code',
  //   text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  // });

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

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isGmail = (email) => {
  return email.toLowerCase().endsWith('@gmail.com');
};

