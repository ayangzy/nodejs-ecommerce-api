const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');
const authenticateUser = require('../middleware/authentication');

router
    .route('/')
    .post(authenticateUser, productController.createProduct)


module.exports = router;