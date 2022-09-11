const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const CustomError = require('../errors');
const { createdResponse, successResponse } = require('../responses/apiResponses');

exports.createReview = async(req, res) => {
    const {product: productId} = req.body;

    const isProductValid = await Product.findOne({_id: productId});

    if(!isProductValid){
        throw new CustomError.NotFoundError(`No product with ID: ${productId}` )
    }

    const alreadySubmitedReview = await Review.findOne({
        product: productId,
        user: req.user.userId
    })

    if(alreadySubmitedReview){
        throw new CustomError.BadRequestError('Already submitted review for this product')
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);

    createdResponse(res, 'Review submited successfully', review);
}

exports.getReviews = async(req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name company price',
    }).populate({
        path: 'user',
        select: 'name'
    });

    successResponse(res, 'reviews retrieved successfully', reviews);
}

exports.getSingleReview = async(req, res) => {
    const {id: reviewId}  = req.params;
    const review = await Review.findOne({_id: reviewId});

    if(!review){
        throw new CustomError.NotFoundError(`No review with id:${reviewId}`)
    }

    successResponse(res, 'Review retreived successfully', review);
}

exports.updateReview = async(req, res) => {
    const { id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`No review with id:${reviewId}`)
    }
    const { title, rating, comment } = req.body;

    review.title = title;
    review.rating = rating;
    review.comment = comment;

    await review.save();
    successResponse(res, 'Review updated successfully', review);
}

 exports.deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
  
    const review = await Review.findOne({ _id: reviewId });
  
    if (!review) {
      throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }
  
    await review.remove();
    successResponse(res, 'Review deleted successfully');
  };
  
  exports.getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate({
        path: 'user',
        select: 'name email'
    });
    successResponse(res, 'Product reviews retreived successfully', reviews, {count: reviews.length});
  };