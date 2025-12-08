import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend root directory
dotenv.config({ path: join(__dirname, '../../.env') });

// Validate that Razorpay keys are present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Razorpay API keys are missing!');
  console.error('Please check your .env file in the backend directory.');
  console.error('Required: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount, currency = 'INR') => {
  try {
    // Validate Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay API keys are not configured. Please check your .env file.');
    }

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error(`Razorpay order creation failed: ${error.message || 'Unknown error'}`);
  }
};

export const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const crypto = await import('crypto');
  
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    return true;
  }
  return false;
};

export default razorpay;

