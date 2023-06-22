const jwt = require('jsonwebtoken');
const User = require('./models/user.model');

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'token');
    console.log("here : ", decodedToken);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const hasRole = (role) => {
  return async (req, res, next) => {
    const currentCustomer = await User.findById(req.userId);

    console.log("here currentCustomer : ",currentCustomer);
    if (!currentCustomer || currentCustomer.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

const isOwner = (objectId, userId) => {
  return (req, res, next) => {
    if (req.user.role === 'Admin' || req.user._id.toString() === objectId.toString()) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  };
};

module.exports = {
  authenticateUser,
  hasRole,
  isOwner,
};
