# Admin Panel Credentials

## Current Admin Account

The default admin account is:

**Email:** `projecthubvnb@gmail.com`  
**Password:** `admin123` (Change this after first login!)

You can now login to the admin panel with this account!

**Note:** If you need to create or update the admin user, run:
```bash
cd backend
npm run create-admin
```

## How to Make an Existing User an Admin

If you need to make another user an admin:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Make sure your `.env` file is configured with MongoDB connection string.

3. Run the make-admin script with the user's email:
   ```bash
   npm run make-admin -- user@example.com
   ```

## How to Create a New Admin User

To create a brand new admin user:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Make sure your `.env` file is configured with MongoDB connection string.

3. Run the admin creation script:
   ```bash
   npm run create-admin
   ```

4. The script will create an admin user with default credentials (check the script for details).

## Accessing Admin Panel

1. Start the admin panel:
   ```bash
   cd admin-panel
   npm run dev
   ```

2. Open your browser and go to: `http://localhost:3001`

3. Login with the admin credentials.

## Creating Custom Admin User

If you want to create an admin user with custom credentials, you can:

### Option 1: Modify the script
Edit `backend/src/layouts/db-operations/createAdmin.js` and change:
- Email: `admin@example.com` → your email
- Password: `admin123` → your password

### Option 2: Use MongoDB directly
1. Connect to your MongoDB database
2. Find the `users` collection
3. Insert a new document:
   ```json
   {
     "name": "Your Name",
     "email": "your-email@gmail.com",
     "password": "hashed_password_here",
     "role": "admin"
   }
   ```
   Note: Password must be hashed using bcrypt.

### Option 3: Register through the app and update role
1. Register a new user through the main app (frontend)
2. Go to MongoDB and update that user's `role` field to `"admin"`

## Security Notes

- Always change the default password in production
- Use strong passwords
- Keep admin credentials secure
- Consider implementing 2FA for admin accounts
- Regularly audit admin access logs

