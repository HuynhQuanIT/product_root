module.exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).send('Forbidden - Admins only');
};