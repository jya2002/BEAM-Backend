module.exports = function checkRole(...allowedRoles) {
    return (req, res, next) => {
      try {
        const user = req.user; // The user object from the JWT middleware
  
        if (!user || !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Access denied. Insufficient role.' });
        }
  
        next(); // The user has the required role
      } catch (error) {
        console.error('Role check error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
  };
  