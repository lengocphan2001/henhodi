import * as User from '../models/user.model.js';
import * as Girl from '../models/girl.model.js';
import * as Review from '../models/review.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getAll = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({
      success: true,
      data: {
        data: users,
        total: users.length,
        page: 1,
        limit: users.length,
        totalPages: 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const existingUsername = await User.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    const user = await User.createUser({ username, email, password });
    const userWithId = { ...user, _id: user.id };
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ user: userWithId, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const user = await User.updateUser(req.params.id, req.body);
    const userWithId = { ...user, _id: user.id };
    res.json(userWithId);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Get user and verify current password
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await User.verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await User.updatePassword(userId, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalGirls, totalReviews, activeUsers, activeGirls, recentUsers, recentGirls] = await Promise.all([
      User.getTotalUsers(),
      Girl.getTotalGirls(),
      Review.getTotalReviews(),
      User.getActiveUsers(),
      Girl.getActiveGirls(),
      User.getRecentUsers(5),
      Girl.getRecentGirls(5)
    ]);

    res.json({
      totalUsers,
      totalGirls,
      totalReviews,
      activeUsers,
      activeGirls,
      recentUsers,
      recentGirls
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const existingUsername = await User.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    const user = await User.createUser({ username, email, password, role });
    const userWithId = { ...user, _id: user.id };
    res.status(201).json({ success: true, data: userWithId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newStatus = !user.isActive;
    await User.updateUser(req.params.id, { ...user, isActive: newStatus });
    const updatedUser = await User.getUserById(req.params.id);
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 