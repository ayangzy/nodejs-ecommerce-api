const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');
const authenticateUser = require('../middleware/authentication');

router
    .route('/')
    .post(authenticateUser, productController.createProduct)
    .get(authenticateUser, productController.getAllProducts)

router
    .route('/:id')
    .get(authenticateUser, productController.getSingleProduct)
    .patch(authenticateUser, productController.updateProduct)
    .delete(authenticateUser, productController.deleteProduct)

router.post('/upload-image', authenticateUser, productController.uploadProductImage)

module.exports = router;