import db from '../db.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
  const [rows] = await db.query('SELECT id, username, email, role, created_at FROM users');
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const getUserByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { username, email, password, role = 'user' } = userData;
  
  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const [result] = await db.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  );
  
  return { id: result.insertId, username, email, role };
};

export const updateUser = async (id, userData) => {
  const { username, email, role } = userData;
  
  await db.query(
    'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
    [username, email, role, id]
  );
  
  return getUserById(id);
};

export const updatePassword = async (id, newPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
  await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
};

export const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}; 