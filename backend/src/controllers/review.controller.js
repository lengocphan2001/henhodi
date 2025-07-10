import * as Review from '../models/review.model.js';

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, girlId } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const offset = (pageNum - 1) * limitNum;
    
    const reviews = await Review.getAllReviews(limitNum, offset, girlId);
    const total = await Review.getTotalReviews(girlId);
    
    // Process reviews to ensure proper structure
    const processedReviews = reviews.map(review => ({
      ...review,
      _id: review.id,
      createdAt: review.created_at,
      user: review.username ? {
        username: review.username,
        phone: review.phone,
        profile: review.profile ? JSON.parse(review.profile) : null
      } : null
    }));
    
    res.json({
      data: processedReviews,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
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
    
    // Fetch the created review with user information
    const reviewWithUser = await Review.getReviewById(review.id);
    
    // Process the review to match the getAll structure
    const processedReview = {
      ...reviewWithUser,
      _id: reviewWithUser.id,
      createdAt: reviewWithUser.created_at,
      user: reviewWithUser.username ? {
        username: reviewWithUser.username,
        phone: reviewWithUser.phone,
        profile: reviewWithUser.profile ? JSON.parse(reviewWithUser.profile) : null
      } : null
    };
    
    res.status(201).json(processedReview);
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