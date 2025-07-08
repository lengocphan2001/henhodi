import db from '../db.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
  const [rows] = await db.query('SELECT id, username, email, phone, role, isActive, created_at, updated_at FROM users');
  return rows.map(user => ({
    ...user,
    _id: user.id,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }));
};

export const getUsersWithPagination = async (page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;
  let query = 'SELECT id, username, email, phone, role, isActive, created_at, updated_at FROM users';
  let countQuery = 'SELECT COUNT(*) as total FROM users';
  let params = [];
  let countParams = [];

  if (search) {
    const searchCondition = 'WHERE username LIKE ? OR email LIKE ?';
    query += ' ' + searchCondition;
    countQuery += ' ' + searchCondition;
    const searchParam = `%${search}%`;
    params = [searchParam, searchParam];
    countParams = [searchParam, searchParam];
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  const [countRows] = await db.query(countQuery, countParams);

  const users = rows.map(user => ({
    ...user,
    _id: user.id,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }));

  return {
    users,
    total: countRows[0].total,
    page,
    limit,
    totalPages: Math.ceil(countRows[0].total / limit)
  };
};

export const getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, username, email, phone, role, isActive, created_at, updated_at FROM users WHERE id = ?', [id]);
  if (rows[0]) {
    return {
      ...rows[0],
      _id: rows[0].id,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    };
  }
  return undefined;
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
  const { username, email, password, role = 'user', phone = '' } = userData;
  
  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const [result] = await db.query(
    'INSERT INTO users (username, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
    [username, email, hashedPassword, role, phone]
  );
  
  return getUserById(result.insertId);
};

export const updateUser = async (id, userData) => {
  // Build dynamic SQL for partial update
  const fields = [];
  const values = [];
  if (userData.username !== undefined) {
    fields.push('username = ?');
    values.push(userData.username);
  }
  if (userData.email !== undefined) {
    fields.push('email = ?');
    values.push(userData.email);
  }
  if (userData.role !== undefined) {
    fields.push('role = ?');
    values.push(userData.role);
  }
  if (userData.isActive !== undefined) {
    fields.push('isActive = ?');
    values.push(userData.isActive);
  }
  if (userData.phone !== undefined) {
    fields.push('phone = ?');
    values.push(userData.phone);
  }
  if (fields.length === 0) return getUserById(id);
  values.push(id);
  await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
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

export const getTotalUsers = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as total FROM users');
  return rows[0].total;
};

export const getActiveUsers = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as total FROM users WHERE isActive = 1');
  return rows[0].total;
};

export const getRecentUsers = async (limit = 5) => {
  const [rows] = await db.query(
    'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  return rows;
}; 