// admin only
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Access level 'admin' required" });
  }
  next();
};

// provider only
export const providerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'provider') {
    return res.status(403).json({ msg: "Access level 'provider' required" });
  }
  next();
};


export const customerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({ msg: "Access level 'customer' required" });
  }
  next();
};
