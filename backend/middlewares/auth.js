const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.body.userRole;
    
    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện thao tác này'
      });
    }
  };
};

module.exports = {
  checkRole
}; 