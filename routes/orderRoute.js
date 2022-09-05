const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateUser = require('../middleware/authentication');


router.route('/').post(authenticateUser, orderController.createOrder)


router.route('/verify').get(orderController.verifyPayment)


module.exports = router