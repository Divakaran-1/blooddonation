const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood_donation_db');
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.warn(`
 TIP: If you do not have local MongoDB running:
  1. Install MongoDB Community Server OR
  2. Create a free MongoDB Atlas cloud database at https://cloud.mongodb.com
  3. Replace MONGODB_URI in server/.env with your Atlas connection string!
    `);
    // Do not crash the process immediately in dev mode so API health endpoint is still accessible
  }
};

module.exports = connectDB;

