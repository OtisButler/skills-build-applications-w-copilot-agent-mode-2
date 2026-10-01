import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export async function connectDatabase() {
  await mongoose.connect(connectionString);
  console.log('Connected to octofit_db');
}

export default db;
