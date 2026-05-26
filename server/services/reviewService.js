const Analytics = require('../models/Analytics');
const ReviewHistory = require('../models/ReviewHistory');

async function updateAnalytics(reviewDoc) {
  const stats = await calculateAnalytics();
  // Upsert single analytics doc
  let a = await Analytics.findOne();
  if (!a) a = new Analytics();
  a.totalReviews = stats.totalReviews;
  a.averageScore = stats.averageScore;
  a.issueDistribution = stats.issueDistribution;
  a.languageUsage = stats.languageUsage;
  await a.save();
}

async function calculateAnalytics() {
  const reviews = await ReviewHistory.find();
  const total = reviews.length;
  const average = total === 0 ? 0 : Math.round(reviews.reduce((s, r) => s + (r.score || 0), 0) / total);
  const issueDistribution = { High: 0, Medium: 0, Low: 0 };
  const languageUsage = {};
  reviews.forEach(r => {
    if (r.language) languageUsage[r.language] = (languageUsage[r.language] || 0) + 1;
    (r.issues || []).forEach(i => {
      const sev = i.severity || 'Low';
      if (!issueDistribution[sev]) issueDistribution[sev] = 0;
      issueDistribution[sev]++;
    });
  });
  return { totalReviews: total, averageScore: average, issueDistribution, languageUsage };
}

async function recalculateAnalytics() {
  const stats = await calculateAnalytics();
  let a = await Analytics.findOne();
  if (!a) a = new Analytics();
  a.totalReviews = stats.totalReviews;
  a.averageScore = stats.averageScore;
  a.issueDistribution = stats.issueDistribution;
  a.languageUsage = stats.languageUsage;
  await a.save();
}

module.exports = { updateAnalytics, calculateAnalytics, recalculateAnalytics };
