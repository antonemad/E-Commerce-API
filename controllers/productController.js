const path = require("path");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const Product = require("../models/Product");
const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = asyncErrorHandler(async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
});

const getAllProducts = asyncErrorHandler(async (req, res) => {
  const products = await Product.find().populate("reviews");
  res.status(StatusCodes.OK).json({ count: products.length, products });
});

const getSingleProduct = asyncErrorHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No Product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
});

const updateProduct = asyncErrorHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
});

const deleteProduct = asyncErrorHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await Review.deleteMany({ product: product._id });
  await Product.deleteOne({ _id: productId });

  res.status(StatusCodes.OK).json({ msg: "Product deleted successfully" });
});

const uploadImage = asyncErrorHandler(async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError(`No file uploaded`);
  }
  const productImage = req.files.Image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError(`Please upload image`);
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      `Please upload image smaller than 1MB`
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({
    image: `/uploads/${productImage.name}`,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
