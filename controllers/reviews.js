const Review = require("../models/review.js");
const Service = require("../models/service.js");
const verifyToken = require("../middleware/verify-token.js"); 
const express = require("express");
const router = express.Router();

//  create new review
router.post("/:userId/:serviceId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const serviceId = req.params.serviceId;
    const { rating, comment } = req.body;

    const newReview = new Review({
      user: userId,
      service: serviceId,
      rating,
      comment,
    });

    await newReview.save();

    const service = await Service.findById(serviceId);
    service.reviews.push(newReview._id);
    await service.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//show all reviews
router.get("/", async (req, res) => {
  try {
    const foundReviews = await Review.find()
      .populate("user")
      .populate("service");
    res.status(200).json(foundReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// show all reviews for a service
router.get("/service/:serviceId", async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const foundReviews = await Review.find({ service: serviceId })
      .populate("user")
      .populate("service");
    res.status(200).json(foundReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// remove a review
router.delete("/:id", verifyToken, async (req, res) => { 
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404);
      throw new Error("Review not found.");
    }

    if (review.user.toString() !== req.user.id) { 
      return res.status(403).json({ error: "Unauthorized: You are not the owner of this review." });
    }

    await Review.findByIdAndDelete(reviewId);

    const service = await Service.findById(review.service);
    service.reviews = service.reviews.filter(
      (id) => id.toString() !== reviewId.toString()
    );
    await service.save();

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// edit the review
router.put("/:id", verifyToken, async (req, res) => { 
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404);
      throw new Error("Review not found.");
    }

    if (review.user.toString() !== req.user.id) { 
      return res.status(403).json({ error: "Unauthorized: You are not the owner of this review." });
    }

    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    })
      .populate("user")
      .populate("service");

    res.status(200).json(updatedReview);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;