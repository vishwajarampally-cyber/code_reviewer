const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const reviewController = require('../controllers/reviewController');

router.post(
  '/review',
  [
    body('code').isString().notEmpty(),
    body('language').isString().notEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      await reviewController.createReview(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/reviews', async (req, res, next) => {
  try {
    await reviewController.listReviews(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics', async (req, res, next) => {
  try {
    await reviewController.getAnalytics(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/review/:id', async (req, res, next) => {
  try {
    await reviewController.deleteReview(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
