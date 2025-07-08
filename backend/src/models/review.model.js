import db from '../db.js';

export const getAllReviews = async (limit = 10, offset = 0, girlId = null) => {
  limit = Number(limit) || 10;
  offset = Number(offset) || 0;
  let query = `
    SELECT r.*, u.username, u.phone, u.profile 
    FROM reviews r 
    LEFT JOIN users u ON r.userId = u.id
  `;
  
  const params = [];
  
  if (girlId) {
    query += ' WHERE r.girlId = ?';
    params.push(girlId);
  }
  
  query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const [rows] = await db.query(query, params);
  return rows;
};

export const getReviewById = async (id) => {
  const [rows] = await db.query(`
    SELECT r.*, u.username, u.profile 
    FROM reviews r 
    LEFT JOIN users u ON r.userId = u.id 
    WHERE r.id = ?
  `, [id]);
  return rows[0];
};

export const createReview = async (review) => {
  const [result] = await db.query('INSERT INTO reviews SET ?', review);
  return { id: result.insertId, ...review };
};

export const deleteReview = async (id) => {
  await db.query('DELETE FROM reviews WHERE id = ?', [id]);
};

export const getTotalReviews = async (girlId = null) => {
  let query = 'SELECT COUNT(*) as total FROM reviews';
  const params = [];
  
  if (girlId) {
    query += ' WHERE girlId = ?';
    params.push(girlId);
  }
  
  const [rows] = await db.query(query, params);
  return rows[0].total;
}; 