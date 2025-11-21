import db from '../db.js';

export const getAllSettings = async () => {
  // Use execute() for consistency
  const [rows] = await db.execute('SELECT key_name, value FROM settings ORDER BY key_name');
  const settings = {};
  rows.forEach(row => {
    settings[row.key_name] = row.value;
  });
  console.log('getAllSettings returned:', Object.keys(settings).length, 'settings');
  return settings;
};

export const getSetting = async (key) => {
  const [rows] = await db.query('SELECT value FROM settings WHERE key_name = ?', [key]);
  return rows.length > 0 ? rows[0].value : null;
};

export const updateSetting = async (key, value) => {
  const [result] = await db.query(
    'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?, updated_at = CURRENT_TIMESTAMP',
    [key, value, value]
  );
  return result;
};

export const updateMultipleSettings = async (settings) => {
  const connection = await db.getConnection();
  try {
    // Set isolation level to READ COMMITTED to see committed changes immediately
    await connection.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await connection.beginTransaction();
    
    console.log('Starting transaction, updating settings:', Object.keys(settings));
    console.log('Settings values being saved:', JSON.stringify(settings, null, 2));
    
    for (const [key, value] of Object.entries(settings)) {
      if (!key || value === undefined || value === null) {
        console.warn(`Skipping invalid setting: key=${key}, value=${value}`);
        continue;
      }
      
      const stringValue = String(value);
      // Use execute() instead of query() for prepared statements in transactions
      const [result] = await connection.execute(
        'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?, updated_at = CURRENT_TIMESTAMP',
        [key, stringValue, stringValue]
      );
      console.log(`Updated setting ${key} = "${stringValue}", affected rows:`, result.affectedRows, 'changed rows:', result.changedRows);
      
      // Immediately verify the update on the same connection
      const [verify] = await connection.execute('SELECT value FROM settings WHERE key_name = ?', [key]);
      console.log(`  → Verification on same connection for ${key}:`, verify[0]?.value, 'Expected:', stringValue);
    }
    
    await connection.commit();
    console.log('Transaction committed successfully');
    
    // Verify after commit using the same connection
    const keys = Object.keys(settings);
    if (keys.length > 0) {
      const placeholders = keys.map(() => '?').join(',');
      const [verifyRows] = await connection.execute(
        `SELECT key_name, value FROM settings WHERE key_name IN (${placeholders})`, 
        keys
      );
      console.log('Post-commit verification on same connection:', verifyRows);
    }
    
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('Transaction rolled back due to error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  } finally {
    connection.release();
  }
};

