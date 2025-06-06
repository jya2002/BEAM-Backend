

module.exports = function (req, res, next) {
    const user = req.user;
  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. User not logged in.' });
    }
  
    const allowedRoles = ['admin', 'employee'];
  
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Not a business user.' });
    }
  
    next();
  };
  