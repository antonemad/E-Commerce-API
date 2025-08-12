const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.find({ role: "user" });
  res.status(StatusCodes.OK).json({ users });
});

const getSingleUser = asyncErrorHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new CustomError.NotFoundError(`No User with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
});

const showCurrentUser = asyncErrorHandler(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

const updateUser = asyncErrorHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError(`Please Provide all values`);
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
});

const updateUserPassword = asyncErrorHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(`Please provide Both values`);
  }
  const user = await User.findOne({ _id: req.user.userId }).select("+password");
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(`Invalid Credentials`);
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "password updated",
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
