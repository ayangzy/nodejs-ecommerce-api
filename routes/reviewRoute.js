const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const reviewController = require('../controllers/reviewController');


router
    .route('/')
    .get(reviewController.getReviews)
    .post(authenticateUser, reviewController.createReview)

router
    .route('/:id')
    .get(reviewController.getSingleReview)
    .patch(authenticateUser,reviewController.updateReview)
    .delete(authenticateUser, reviewController.deleteReview)

router.route('/product/:id/review').get(reviewController.getSingleProductReviews)

module.exports = router;