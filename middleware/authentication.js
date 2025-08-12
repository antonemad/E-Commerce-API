const jwt = require("jsonwebtoken");

const CustomError = require("../errors");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  let token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }
});

const authorizePermissions = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        `You don't have permission to perfrom this action`
      );
    }
    next();
  };
};
module.exports = {
  authenticateUser,
  authorizePermissions,
};
