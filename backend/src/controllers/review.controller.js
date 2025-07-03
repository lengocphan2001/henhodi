import * as Review from '../models/review.model.js';

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, girlId } = req.query;
    const offset = (page - 1) * limit;
    
    const reviews = await Review.getAllReviews(limit, offset, girlId);
    const total = await Review.getTotalReviews(girlId);
    
    res.json({
      data: reviews,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const review = await Review.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user.userId,
      created_at: new Date()
    };
    
    const review = await Review.createReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const review = await Review.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    
    await Review.deleteReview(req.params.id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 