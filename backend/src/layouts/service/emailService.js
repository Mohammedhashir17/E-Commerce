import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. OTP will only be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
  });
};

export const sendOTPEmail = async (email, otp, purpose = 'login') => {
  const transporter = createTransporter();

  if (!transporter) {
    // Fallback: log to console if email not configured
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 OTP Email (Not Sent - Email Not Configured)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`To: ${email}`);
    console.log(`Purpose: ${purpose === 'login' ? 'Login' : 'Registration'}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires in: 5 minutes`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    return true;
  }

  const purposeText = purpose === 'login' ? 'Login' : 'Registration';
  const mailOptions = {
    from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your ${purposeText} OTP Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #835DC2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">E-Commerce</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Your ${purposeText} OTP Code</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hello,
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You requested an OTP code for ${purpose === 'login' ? 'logging into' : 'registering with'} your account.
          </p>
          <div style="background-color: #F4F2FF; border: 2px dashed #835DC2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Your OTP Code:</p>
            <h1 style="color: #835DC2; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This code will expire in <strong>5 minutes</strong>. Please do not share this code with anyone.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `,
    text: `
E-Commerce - ${purposeText} OTP Code

Your OTP code is: ${otp}

This code will expire in 5 minutes. Please do not share this code with anyone.

If you didn't request this code, please ignore this email.
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    // Fallback to console logging if email fails
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 OTP Email (Failed to Send - Using Fallback)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`To: ${email}`);
    console.log(`Purpose: ${purposeText}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires in: 5 minutes`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    return true; // Return true so OTP is still stored
  }
};

