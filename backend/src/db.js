import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'henhodi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database initialization function
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Create tables if they don't exist
    await createTables();
    
    // Insert default admin user if not exists
    await createDefaultAdmin();
    
    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Create all necessary tables
const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        isActive BOOLEAN DEFAULT TRUE,
        phone VARCHAR(20),
        profile JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add phone column if it doesn't exist (migration)
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
      console.log('✅ Added phone column to users table');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Phone column already exists in users table');
      } else {
        console.log('ℹ️ Could not add phone column:', error.message);
      }
    }

    // Add profile column if it doesn't exist (migration)
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN profile JSON');
      console.log('✅ Added profile column to users table');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Profile column already exists in users table');
      } else {
        console.log('ℹ️ Could not add profile column:', error.message);
      }
    }

    // Drop and recreate girls table to fix BLOB field issues
    try {
      // Disable foreign key checks temporarily
      await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
      
      // Drop tables in correct order
      // await connection.execute('DROP TABLE IF EXISTS reviews');
      // console.log('🗑️ Dropped reviews table');
      
      // await connection.execute('DROP TABLE IF EXISTS girls');
      // console.log('🗑️ Dropped girls table');
      
      // Re-enable foreign key checks
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.log('ℹ️ Could not drop tables:', error.message);
    }

    // Create girls table with proper BLOB configuration
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS girls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        area VARCHAR(255) NOT NULL,
        price VARCHAR(255) NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0,
        img LONGBLOB NULL,
        img_url VARCHAR(500) DEFAULT '',
        zalo VARCHAR(255) NULL,
        phone VARCHAR(20) NULL,
        description TEXT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        isPinned BOOLEAN DEFAULT FALSE,
        info JSON NULL,
        images JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Add isPinned column if it doesn't exist (for existing databases - migration support)
    try {
      await connection.execute('ALTER TABLE girls ADD COLUMN isPinned BOOLEAN DEFAULT FALSE');
      console.log('✅ Added isPinned column to girls table');
    } catch (error) {
      // Column might already exist, that's okay
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ isPinned column may already exist');
      }
    }
    
    // Add displayOrder column if it doesn't exist (new feature)
    try {
      await connection.execute('ALTER TABLE girls ADD COLUMN displayOrder INT DEFAULT 0');
      console.log('✅ Added displayOrder column to girls table');
      
      // Migrate existing isPinned data to displayOrder
      // If isPinned = true, set displayOrder = 1, otherwise 0
      await connection.execute(`
        UPDATE girls 
        SET displayOrder = CASE WHEN isPinned = 1 THEN 1 ELSE 0 END
        WHERE displayOrder = 0
      `);
      console.log('✅ Migrated isPinned data to displayOrder');
    } catch (error) {
      // Column might already exist, that's okay
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ displayOrder column may already exist');
      }
    }
    
    // Add viewed column if it doesn't exist
    try {
      await connection.execute('ALTER TABLE girls ADD COLUMN viewed INT DEFAULT 5000');
      console.log('✅ Added viewed column to girls table');
      // Set default value for existing records
      await connection.execute('UPDATE girls SET viewed = 5000 WHERE viewed IS NULL OR viewed = 0');
      console.log('✅ Set default viewed value for existing girls');
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        console.log('ℹ️ viewed column may already exist');
      }
    }
    console.log('✅ Created girls table with proper BLOB configuration');

    // Create detail_images table for multiple images per girl
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS detail_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        girl_id INT NOT NULL,
        image_data LONGBLOB NOT NULL,
        image_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created detail_images table for multiple images per girl');

    // Recreate reviews table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        girlId INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (girlId) REFERENCES girls(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created reviews table');

    // Create settings table for site configuration
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        key_name VARCHAR(255) NOT NULL UNIQUE,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created settings table');

    // Insert default settings if they don't exist
    const defaultSettings = [
      { key: 'zalo', value: '' },
      { key: 'zalo2', value: '' },
      { key: 'zalo3', value: '' },
      { key: 'hotline', value: '' },
      { key: 'email', value: 'contact@chumgaiphuquoc.com' },
      { key: 'service1', value: 'Gái Gọi Phú Quốc' },
      { key: 'service2', value: 'Massage Phú Quốc' },
      { key: 'service3', value: 'Karaoke Phú Quốc' },
      { key: 'service4', value: 'Bar Phú Quốc' }
    ];

    for (const setting of defaultSettings) {
      try {
        await connection.execute(
          'INSERT INTO settings (key_name, value) VALUES (?, ?)',
          [setting.key, setting.value]
        );
      } catch (error) {
        // Setting already exists, skip
        if (!error.message.includes('Duplicate entry')) {
          console.log(`ℹ️ Could not insert setting ${setting.key}:`, error.message);
        }
      }
    }
    console.log('✅ Initialized default settings');

    // Create indexes for better performance
    await createIndexes(connection);
    
    console.log('📋 Database tables created successfully');
  } finally {
    connection.release();
  }
};

// Create indexes for performance
const createIndexes = async (connection) => {
  try {
    // Users indexes
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    
    // Girls indexes
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_girls_area ON girls(area)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_girls_rating ON girls(rating)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_girls_active ON girls(isActive)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_girls_pinned ON girls(isPinned)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_girls_display_order ON girls(displayOrder)');
    
    // Reviews indexes
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(userId)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_reviews_girl ON reviews(girlId)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at)');
    
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    // Indexes might already exist, that's okay
    console.log('ℹ️ Some indexes may already exist');
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@henhodi.com']
    );

    if (existingAdmin.length === 0) {
      // Create default admin user (password: admin123)
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 10);
      
      await connection.execute(`
        INSERT INTO users (username, email, password, role) 
        VALUES (?, ?, ?, ?)
      `, ['admin', 'admin@henhodi.com', hashedPassword, 'admin']);
      
      console.log('👤 Default admin user created');
      console.log('   Username: admin');
      console.log('   Email: admin@henhodi.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } finally {
    connection.release();
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('🔗 Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('Access denied')) {
      console.error('\n🔧 Database Connection Troubleshooting:');
      console.error('1. Check your .env file exists in the backend directory');
      console.error('2. Verify database credentials:');
      console.error(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
      console.error(`   DB_USER: ${process.env.DB_USER || 'root'}`);
      console.error(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***set***' : 'NOT SET'}`);
      console.error(`   DB_NAME: ${process.env.DB_NAME || 'henhodi'}`);
      console.error('\n3. Make sure MySQL is running: sudo systemctl status mysql');
      console.error('4. Create the database: CREATE DATABASE henhodi;');
      console.error('5. Check user permissions or try a different user');
      console.error('\n💡 Quick fix: Create .env file with:');
      console.error('   cp env.example .env');
      console.error('   # Then edit .env with your database credentials');
    } else if (error.message.includes('Unknown database')) {
      console.error('\n🔧 Database does not exist. Create it with:');
      console.error('   mysql -u root -p -e "CREATE DATABASE henhodi;"');
    }
    
    return false;
  }
};

// Initialize database on module load
let isInitialized = false;

const initialize = async () => {
  if (isInitialized) return;
  
  const isConnected = await testConnection();
  if (isConnected) {
    await initializeDatabase();
    isInitialized = true;
  } else {
    console.log('\n⚠️  Server will start without database initialization');
    console.log('   Some features may not work until database is configured');
  }
};

// Export the pool and initialization function
export default pool;
export { initialize, testConnection }; 