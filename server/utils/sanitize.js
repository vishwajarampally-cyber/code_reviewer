const sanitizeHtml = require('sanitize-html');

function sanitizeInput(text) {
  if (!text) return text;
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

module.exports = { sanitizeInput };
