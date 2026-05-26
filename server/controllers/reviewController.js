const ReviewHistory = require('../models/ReviewHistory');
const Analytics = require('../models/Analytics');
const connectDB = require('../config/db');
const aiProvider = require('../services/ai/aiProvider');
const reviewService = require('../services/reviewService');

exports.createReview = async (req, res) => {
  const { code, language } = req.body;
  const prompt = require('../services/ai/promptService').buildPrompt(code, language);

  const aiResponse = await aiProvider.reviewCode(prompt);

  // Expect aiResponse to be structured JSON per system prompt
  const parsed = aiResponse;

  const score = Number(parsed.score) || 0;

  const payload = {
    language,
    originalCode: code,
    reviewSummary: parsed.summary || parsed.reviewSummary || '',
    score,
    issues: parsed.issues || [],
    improvedCode: parsed.improvedCode || parsed.improved_code || '',
    bestPractices: parsed.bestPractices || parsed.best_practices || []
  };

  // If MongoDB is connected, persist review and update analytics. Otherwise return mock response without saving.
  await connectDB();
  const mongoose = require('mongoose');
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    const reviewDoc = new ReviewHistory(payload);
    await reviewDoc.save();
    await reviewService.updateAnalytics(reviewDoc);
    res.json({ success: true, review: {
      summary: reviewDoc.reviewSummary,
      score: `${reviewDoc.score}/100`,
      issues: reviewDoc.issues,
      improvedCode: reviewDoc.improvedCode,
      bestPractices: reviewDoc.bestPractices
    }});
  } else {
    console.warn('MongoDB not connected - skipping save for review');
    res.json({ success: true, review: {
      summary: payload.reviewSummary,
      score: `${payload.score}/100`,
      issues: payload.issues,
      improvedCode: payload.improvedCode,
      bestPractices: payload.bestPractices
    }});
  }
};

exports.listReviews = async (req, res) => {
  try {
    await connectDB();
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const records = await ReviewHistory.find().sort({ createdAt: -1 }).limit(100);
      return res.json({ success: true, reviews: records });
    }
    return res.json({ success: true, reviews: [], message: 'Database disconnected' });
  } catch (err) {
    console.error('Error listing reviews:', err.message);
    res.json({ success: true, reviews: [], message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    await connectDB();
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const agg = await reviewService.calculateAnalytics();
      return res.json({ success: true, analytics: agg });
    }
    return res.json({ 
      success: true, 
      analytics: { totalReviews: 0, averageScore: 0, issueDistribution: { High: 0, Medium: 0, Low: 0 }, languageUsage: {} },
      message: 'Database disconnected' 
    });
  } catch (err) {
    console.error('Error getting analytics:', err.message);
    res.json({ 
      success: true, 
      analytics: { totalReviews: 0, averageScore: 0, issueDistribution: { High: 0, Medium: 0, Low: 0 }, languageUsage: {} },
      message: err.message 
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await connectDB();
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const removed = await ReviewHistory.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success: false, message: 'Not found' });
      // Recalculate analytics
      await reviewService.recalculateAnalytics();
      return res.json({ success: true });
    }
    return res.status(503).json({ success: false, message: 'Database disconnected' });
  } catch (err) {
    console.error('Error deleting review:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
