const Product = require('../models/productModel');
const { createdResponse, successResponse } = require('../responses/apiResponses')
const CustomError = require('../errors');

exports.createProduct = async(req, res) => {
    
    req.body.user = req.user.userId;
    const product = await Product.findOne({name: req.body.name});
    if(product){
        throw new CustomError.BadRequestError('Product already added');
    }
    const newProduct = await Product.create(req.body);
    createdResponse(res, 'Product created successfully', newProduct);
}