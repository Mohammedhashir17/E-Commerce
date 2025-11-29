# Email Configuration Summary

## Admin Account
- **Email:** `projecthubvnb@gmail.com`
- **Password:** `admin123` (Change after first login!)
- **Role:** Admin

## Email Service Configuration

To send OTP emails, add these to your `backend/.env` file:

```env
EMAIL_USER=projecthubvnb@gmail.com
EMAIL_PASS=your-gmail-app-password-here
```

### Steps to Get Gmail App Password:

1. Go to https://myaccount.google.com/ → **Security**
2. Enable **2-Step Verification** (if not enabled)
3. Go to **App passwords** → **Generate**
4. Select "Mail" and "Other (Custom name)"
5. Name it "E-Commerce OTP Service"
6. Copy the 16-character password
7. Add it to `.env` as `EMAIL_PASS`

### Example .env Configuration:

```env
PORT=5000
MONGODB_URI=mongodb+srv://root:amh%400203@e-commerce.felcyk3.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=projecthubvnb@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

## Important Notes:

- The email `projecthubvnb@gmail.com` is used for:
  - Admin panel login
  - Sending OTP emails to users
- Make sure to get the App Password from the Gmail account
- Never commit the `.env` file to Git
- Change the admin password after first login

For detailed email setup instructions, see `EMAIL_SETUP.md`.

