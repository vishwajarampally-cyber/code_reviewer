module.exports = function (err, req, res, next) {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
};
