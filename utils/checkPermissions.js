const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (resourceUserId.toString() !== requestUser.userId.toString()) {
    throw new CustomError.UnauthenticatedError(
      `Not authorized to access this route`
    );
  }
};

module.exports = checkPermissions;
