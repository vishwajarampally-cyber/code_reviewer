const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  totalReviews: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  issueDistribution: { type: Object, default: {} },
  languageUsage: { type: Object, default: {} }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
