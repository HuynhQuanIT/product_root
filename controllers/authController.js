const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // optional for email

exports.registerForm = (req, res) => res.render('register');

exports.register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const user = new User({ username, email, password, phone });
    // If first user -> make admin (optional)
    const count = await User.countDocuments();
    if (count === 0) user.role = 'admin';
    await user.save();
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Registration failed: ' + err.message });
  }
};

exports.loginForm = (req, res) => res.render('login');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render('login', { error: 'Invalid email or password' });
    const match = await user.comparePassword(password);
    if (!match) return res.render('login', { error: 'Invalid email or password' });
    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};

// Forgot password: set token and expiry, send link (use nodemailer or show link)
exports.forgotForm = (req, res) => res.render('forgot');

exports.forgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render('forgot', { info: 'If that email exists, a reset link was sent.' });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // send email (example using console if nodemailer not configured)
  const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset/${token}`;
  console.log('Password reset link:', resetUrl);

  // Optional: send mail with nodemailer
  /*
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({ to: user.email, from: 'no-reply@example.com', subject: 'Password reset', text: `Reset: ${resetUrl}` });
  */

  res.render('forgot', { info: 'If that email exists, a reset link was sent (check console in dev).' });
};

exports.resetForm = async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.send('Token invalid or expired');
  res.render('reset', { token });
};

exports.reset = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }});
  if (!user) return res.send('Token invalid or expired');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.redirect('/login');
};