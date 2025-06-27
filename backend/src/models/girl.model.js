import db from '../db.js';

export const getAllGirls = async () => {
  const [rows] = await db.query('SELECT * FROM girls');
  return rows;
};

export const getGirlById = async (id) => {
  const [rows] = await db.query('SELECT * FROM girls WHERE id = ?', [id]);
  return rows[0];
};

export const createGirl = async (girl) => {
  const [result] = await db.query('INSERT INTO girls SET ?', girl);
  return { id: result.insertId, ...girl };
};

export const updateGirl = async (id, girl) => {
  await db.query('UPDATE girls SET ? WHERE id = ?', [girl, id]);
  return getGirlById(id);
};

export const deleteGirl = async (id) => {
  await db.query('DELETE FROM girls WHERE id = ?', [id]);
}; 