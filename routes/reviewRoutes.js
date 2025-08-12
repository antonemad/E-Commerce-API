const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  getAllReviews,
  getSingleReview,
  createReivew,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.route("/").post(authenticateUser, createReivew).get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
