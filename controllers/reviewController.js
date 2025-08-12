const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

//create Review
const createReivew = asyncErrorHandler(async (req, res) => {
  const { product: productId } = req.body;

  const isValidProudct = await Product.findOne({ _id: productId });
  if (!isValidProudct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      `Already submitted review for this product`
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
});

//Get All Reviews
const getAllReviews = asyncErrorHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });

  res.status(StatusCodes.OK).json({
    count: reviews.length,
    reviews,
  });
});

//get Single Review
const getSingleReview = asyncErrorHandler(async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}  `);
  }

  res.status(StatusCodes.OK).json({ review });
});

//updateReview
const updateReview = asyncErrorHandler(async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}  `);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
});

//deleteReview
const deleteReview = asyncErrorHandler(async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}  `);
  }

  checkPermissions(req.user, review.user);

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Review Removed" });
});

//get single Product Review
const getSingleProductReviews = asyncErrorHandler(async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
});

//Export
module.exports = {
  createReivew,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
