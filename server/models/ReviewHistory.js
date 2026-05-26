const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  severity: { type: String },
  line: { type: String },
  problem: { type: String },
  solution: { type: String }
});

const ReviewHistorySchema = new mongoose.Schema({
  language: { type: String, required: true },
  originalCode: { type: String, required: true },
  reviewSummary: { type: String },
  score: { type: Number },
  issues: { type: [IssueSchema], default: [] },
  improvedCode: { type: String },
  bestPractices: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReviewHistory', ReviewHistorySchema);
