#!/usr/bin/env node

/**
 * Database Setup Script for Henhodi
 * 
 * This script can be run independently to set up the database:
 * node setup-database.js
 * 
 * Or it will run automatically when the server starts.
 */

import { initialize, testConnection } from './src/db.js';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  console.log('🔧 Henhodi Database Setup');
  console.log('========================');
  
  try {
    // Test connection first
    console.log('\n1️⃣ Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Cannot connect to database. Please check your configuration:');
      console.error('   - Database server is running');
      console.error('   - Database credentials are correct');
      console.error('   - Database exists');
      console.error('\nEnvironment variables:');
      console.error(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
      console.error(`   DB_USER: ${process.env.DB_USER || 'root'}`);
      console.error(`   DB_NAME: ${process.env.DB_NAME || 'henhodi'}`);
      process.exit(1);
    }
    
    // Initialize database
    console.log('\n2️⃣ Initializing database...');
    await initialize();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 What was created:');
    console.log('   - users table (with indexes)');
    console.log('   - girls table (with indexes)');
    console.log('   - reviews table (with indexes)');
    console.log('   - Default admin user');
    console.log('\n👤 Default Admin Account:');
    console.log('   Username: admin');
    console.log('   Email: admin@henhodi.com');
    console.log('   Password: admin123');
    console.log('\n🚀 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check your .env file configuration');
    console.error('3. Ensure the database exists');
    console.error('4. Verify user permissions');
    process.exit(1);
  }
};

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
} 