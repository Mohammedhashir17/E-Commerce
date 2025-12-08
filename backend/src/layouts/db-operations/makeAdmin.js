import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found!`);
      console.log('Please make sure the user exists in the database.');
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`✅ User ${email} is already an admin!`);
      process.exit(0);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ User role updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('You can now login to the admin panel with this account!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js hashir.aj2017@gmail.com');
  process.exit(1);
}

makeAdmin(email);

