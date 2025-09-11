const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const promoteToAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return;
    }

    // Add admin role if not already present
    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
      await user.save();
      console.log(`User ${user.username} (${user.email}) has been promoted to admin`);
    } else {
      console.log(`User ${user.username} (${user.email}) is already an admin`);
    }

    console.log('Current roles:', user.roles);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Get email from command line arguments
const email = process.argv[2];
if (!email) {
  console.log('Usage: node promote-admin.js <email>');
  console.log('Example: node promote-admin.js admin@example.com');
  process.exit(1);
}

promoteToAdmin(email);




