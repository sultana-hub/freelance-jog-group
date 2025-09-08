
const roleMiddleware = (roles) => (req, res, next) => {
  // convert single string into array
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access forbidden: insufficient role' });
  }
  next();
};

module.exports = roleMiddleware;
