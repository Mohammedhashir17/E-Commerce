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
    from: `"ZUKA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your ${purposeText} OTP Code`,
    html: `
      <div style="font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050509;">
        <div style="background: linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%); color: #FFFFFF; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 18px 40px rgba(108, 43, 217, 0.3);">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ZUKA</h1>
        </div>
        <div style="background-color: #0D0D16; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.75); border: 1px solid #262638;">
          <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px; font-weight: 600; margin-bottom: 20px;">Your ${purposeText} OTP Code</h2>
          <p style="color: #B3B3C2; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
            Hello,
          </p>
          <p style="color: #B3B3C2; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            You requested an OTP code for ${purpose === 'login' ? 'logging into' : 'registering with'} your account.
          </p>
          <div style="background: linear-gradient(135deg, rgba(108, 43, 217, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 2px dashed #6C2BD9; border-radius: 12px; padding: 25px 10px; text-align: center; margin: 30px 0; backdrop-filter: blur(10px); min-width: 0;">
            <p style="color: #B3B3C2; font-size: 14px; margin: 0 0 15px 0; font-weight: 500;">Your OTP Code:</p>
            <h1 style="color: #8B5CF6; font-size: 38px; font-weight: 700; margin: 0; letter-spacing: 5px; text-shadow: 0 0 20px rgba(139, 92, 246, 0.5); white-space: nowrap; display: inline-block; word-break: keep-all; overflow-wrap: normal;">${otp}</h1>
          </div>
          <p style="color: #B3B3C2; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            This code will expire in <strong style="color: #FFFFFF;">5 minutes</strong>. Please do not share this code with anyone.
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #262638; line-height: 1.6;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #666; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} ZUKA. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
ZUKA - ${purposeText} OTP Code

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

