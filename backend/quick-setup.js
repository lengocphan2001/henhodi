#!/usr/bin/env node

/**
 * Quick Setup Script for Henhodi
 * 
 * This script helps you quickly set up the database and environment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupEnvironment = () => {
  console.log('🔧 Henhodi Quick Setup');
  console.log('======================');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, 'env.example');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('ℹ️  .env file already exists');
    return true;
  }
  
  // Check if env.example exists
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ env.example file not found');
    return false;
  }
  
  try {
    // Copy env.example to .env
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
    
    console.log('\n📝 Next steps:');
    console.log('1. Edit the .env file with your database credentials:');
    console.log('   nano .env');
    console.log('   # or');
    console.log('   code .env');
    console.log('\n2. Update these values:');
    console.log('   DB_PASSWORD=your_mysql_password');
    console.log('   JWT_SECRET=your_random_secret_key');
    console.log('\n3. Start the server:');
    console.log('   npm run dev');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    return false;
  }
};

const checkMySQL = () => {
  console.log('\n🔍 Checking MySQL status...');
  
  // This is a simple check - in a real scenario you'd want to test the connection
  console.log('💡 Make sure MySQL is running:');
  console.log('   sudo systemctl status mysql');
  console.log('   # or');
  console.log('   sudo service mysql status');
  console.log('\n💡 If MySQL is not running, start it with:');
  console.log('   sudo systemctl start mysql');
  console.log('   # or');
  console.log('   sudo service mysql start');
};

const createDatabase = () => {
  console.log('\n🗄️  Database Setup:');
  console.log('1. Connect to MySQL as root:');
  console.log('   mysql -u root -p');
  console.log('\n2. Create the database:');
  console.log('   CREATE DATABASE henhodi;');
  console.log('   exit;');
  console.log('\n💡 Or run this command directly:');
  console.log('   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS henhodi;"');
};

const main = () => {
  console.log('🚀 Welcome to Henhodi Setup!\n');
  
  // Setup environment file
  const envCreated = setupEnvironment();
  
  if (envCreated) {
    checkMySQL();
    createDatabase();
    
    console.log('\n✅ Setup complete!');
    console.log('\n📋 Summary:');
    console.log('1. ✅ .env file created');
    console.log('2. ⏳ Edit .env with your database credentials');
    console.log('3. ⏳ Ensure MySQL is running');
    console.log('4. ⏳ Create henhodi database');
    console.log('5. ⏳ Run: npm run dev');
    
    console.log('\n🎯 Quick commands:');
    console.log('   # Edit environment file');
    console.log('   nano .env');
    console.log('\n   # Create database');
    console.log('   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS henhodi;"');
    console.log('\n   # Start server');
    console.log('   npm run dev');
  } else {
    console.log('\n❌ Setup failed. Please check the errors above.');
  }
};

// Run setup
main(); 