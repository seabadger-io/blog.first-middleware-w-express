//Check if user is logged in
exports.checkSession = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    err = new Error('Not authenticated');
    err.status = 401;
    return next(err);
  }
}

//Check if user is logged in and is admin
exports.checkAdminSession = function (req, res, next) {
  if (req.user && req.user.admin) {
    next();
  } else {
    if (req.user) {
      err = new Error('Not authorized');
      err.status = 403;
    } else {
      err = new Error('Not authenticated');
      err.status = 401;
    }
    return next(err);
  }
}
