const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');
const authenticateUser = require('../middleware/authentication');

router
    .route('/')
    .post(authenticateUser, productController.createProduct)
    .get(authenticateUser, productController.getAllProducts)


module.exports = router;