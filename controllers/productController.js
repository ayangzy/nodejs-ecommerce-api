const Product = require('../models/productModel');
const { createdResponse, successResponse } = require('../responses/apiResponses')
const CustomError = require('../errors');
const path = require('path');

exports.createProduct = async(req, res) => {

    req.body.user = req.user.userId;
    const product = await Product.findOne({name: req.body.name});
    if(product){
        throw new CustomError.BadRequestError('Product already added');
    }
    const newProduct = await Product.create(req.body);
    createdResponse(res, 'Product created successfully', newProduct);
}

exports.getAllProducts = async(req, res) => {
    const products = await Product.find();
    successResponse(res, 'Products retrieved successfully', products);
}

exports.getSingleProduct = async(req, res) => {

    const product = await Product.findOne({_id: req.params.id});
    
    if(!product){
        throw new CustomError.NotFoundError('Product not found')
    }

    successResponse(res, 'Product retrieved successfully', product);
}

exports.updateProduct = async(req, res) => {

    const productId = req.params.id;
    const product = await Product.findOne({_id: productId})
    if(!product){
        throw new CustomError.NotFoundError('Product not found')
    }

    const updateProduct = await Product.findOneAndUpdate({_id: productId}, req.body, {
        new: true,
        runValidators:true,
    })

    successResponse(res, 'Product updated successfully', updateProduct);
}

exports.deleteProduct = async(req, res) => {

    const product = await Product.findOne({_id: req.params.id})
    if(!product){
        throw new CustomError.NotFoundError('product not found');
    }

    await Product.findOneAndDelete({_id: req.params.id})

    successResponse(res, 'Prdouct deleted successfully');
} 

exports.uploadProductImage = async(req, res) => {

    if (!req.files) {
        throw new CustomError.BadRequestError('No File Uploaded');
      }
      const productImage = req.files.image;
    
      if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please Upload Image');
      }
    
      const maxSize = 1024 * 1024;
    
      if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError(
          'Please upload image smaller than 1MB'
        );
      }
    
      const imagePath = path.join(
        __dirname,
        '../uploads/' + `${productImage.name}`
      );
      
      await productImage.mv(imagePath);
      successResponse(res, 'Product uploaded successfully', { image: { src: `/uploads/${productImage.name}` } })
}