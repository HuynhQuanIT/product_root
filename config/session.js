const session = require('express-session');

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true // prevents XSS attacks
  }
};

module.exports = sessionConfig;