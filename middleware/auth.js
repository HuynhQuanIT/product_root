// Middleware kiểm tra đăng nhập
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Middleware kiểm tra chưa đăng nhập (cho trang login, register)
const requireGuest = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
};

// Middleware xử lý method override (PUT, DELETE)
const methodOverride = (req, res, next) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    req.method = method.toUpperCase();
  }
  next();
};

module.exports = {
  requireAuth,
  requireGuest,
  methodOverride
};