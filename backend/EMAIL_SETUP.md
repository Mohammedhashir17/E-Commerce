# Email Setup for OTP

This guide will help you configure email sending for OTP verification.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", enable **2-Step Verification** (if not already enabled)

### Step 2: Generate App Password

1. Still in Security settings, scroll down to **2-Step Verification**
2. Click on **App passwords** (you may need to sign in again)
3. Select **Mail** as the app and **Other (Custom name)** as the device
4. Enter a name like "E-Commerce OTP Service"
5. Click **Generate**
6. **Copy the 16-character password** (you won't see it again!)

### Step 3: Add to .env File

Add these lines to your `backend/.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=projecthubvnb@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

**Important:** 
- Use your Gmail address (the one you want to send emails from)
- Use the App Password (not your regular Gmail password)
- Remove spaces from the App Password when adding to .env (or keep them, nodemailer handles both)

## Alternative: Other Email Services

If you prefer not to use Gmail, you can use other services:

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Custom SMTP
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
```

Then update `backend/src/layouts/service/emailService.js` to use these variables instead of the Gmail service.

## Testing

1. Make sure your `.env` file has the email credentials
2. Restart your backend server
3. Try to login/register - you should receive an OTP email

## Troubleshooting

### "Invalid login" error
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled

### "Connection timeout" error
- Check your internet connection
- Verify firewall isn't blocking SMTP (port 587)

### Emails not received
- Check spam/junk folder
- Verify the email address in `.env` is correct
- Check backend console for error messages

### Fallback Mode
If email credentials are not configured, the system will:
- Log OTP to the console (for development)
- Still allow OTP verification to work
- Display a warning message

## Security Notes

- **Never commit `.env` file to Git**
- **Never share your App Password**
- Use a dedicated Gmail account for production
- Consider using a professional email service (SendGrid, AWS SES) for production

