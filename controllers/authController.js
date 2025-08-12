const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

/*************  Controllers ************** */

//register
const register = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(`Email already exists`);
  }

  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    user: { tokenUser },
  });
});

//login
const login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(`Please Provide email & Password`);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError.UnauthenticatedError(`Invalid Credentials`);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(`Invalid Credentials`);
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
});

//logout
const logout = asyncErrorHandler(async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({
    msg: "user logged out",
  });
});

module.exports = {
  register,
  login,
  logout,
};
