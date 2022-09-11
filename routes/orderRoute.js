const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateUser = require('../middleware/authentication');


router
    .route('/')
    .post(authenticateUser, orderController.createOrder)
    .get(orderController.getAllOrder)

router.route('/:id').get(orderController.getSingleOrder)
router.route('/user/current').get(authenticateUser, orderController.getCurrentUserOrders)

router.route('/verify/order').get(orderController.verifyPayment)


module.exports = router