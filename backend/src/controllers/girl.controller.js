import * as Girl from '../models/girl.model.js';

export const getAll = async (req, res) => {
  const girls = await Girl.getAllGirls();
  res.json(girls);
};

export const getOne = async (req, res) => {
  const girl = await Girl.getGirlById(req.params.id);
  if (!girl) return res.status(404).json({ message: 'Not found' });
  res.json(girl);
};

export const create = async (req, res) => {
  const girl = await Girl.createGirl(req.body);
  res.status(201).json(girl);
};

export const update = async (req, res) => {
  const girl = await Girl.updateGirl(req.params.id, req.body);
  res.json(girl);
};

export const remove = async (req, res) => {
  await Girl.deleteGirl(req.params.id);
  res.status(204).end();
}; 