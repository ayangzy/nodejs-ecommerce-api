const CustomError = require('../errors')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const { successResponse } = require('../responses/apiResponses')
const { transactionMail } = require('../utils/transactionMail');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET)

exports.createOrder = async (req, res) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body

    if (!cartItems) {
      throw new CustomError.BadRequestError('Please provide cart items')
    }

    if (!tax || !shippingFee) {
      throw new CustomError.BadRequestError(
        'Please provide tax and shipping fees',
      )
    }

    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.productId })
      if (!dbProduct) {
        throw new CustomError.BadRequestError(
          `No product with the id ${item.productId}`,
        )
      }

      const { name, price, image, _id } = dbProduct

      const singleOrderItem = {
        name,
        price,
        image,
        product: _id,
      }

      //add item to order
      orderItems = [...orderItems, singleOrderItem]

      //calculate subtotal
      subtotal += price
    }

    //calculate total
    total = subtotal + shippingFee + tax

    const response = await paystack.transaction.initialize({
      amount: total * 100,
      email: req.user.email,
      currency: 'NGN',
      callback_url: process.env.PAYSTACK_VERIFY_PAYMENT_URL
    })

    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      user: req.user.userId,
      trans_ref: response.data.reference,
    })

    if (response.data.status === false) {
      throw new CustomError.ServerError(
        'Unable to Create Payment, Service is not available',
        response['status'],
      )
    }

    const link = response.data.authorization_url;
    transactionMail(req.user.email, req.user.name);
    successResponse(res, 'Order created successfully', { link })

  } catch (error) {
    throw new CustomError.ServerError('Unable to perform operation', error)
  }
}

exports.verifyPayment = async (req, res) => {
  const transRef = req.query.trxref

  if (!transRef) {
    throw new CustomError.BadRequestError('Invalid transaction reference')
  }

  const order = await Order.findOne({ trans_ref: transRef });
  
  if (!order) {
    throw new CustomError.BadRequestError('Invalid transaction reference')
  }

  const response = await paystack.transaction.verify(`${transRef}`)

  if (response.data.status === 'success') {
    await Order.findOneAndUpdate({trans_ref: order.trans_ref}, {status: 'successful'}, {
        new: true,
    });

    successResponse(res, 'Transaction successful');
  }else{
    await Order.findOneAndUpdate({trans_ref: order.trans_ref}, {status: response.data.status}, {
        new: true,
    });
    throw new CustomError.BadRequestError(`Transaction ${response.data.statsu}`)
  }

}

exports.getAllOrder = async(req, res) => {
  const orders = await Order.find({});

  successResponse(res, 'Orders retreived successfully', orders);
}

exports.getSingleOrder = async(req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({_id: orderId});
  if(!order){
    CustomError.NotFoundError(`Order with the ID ${orderId} not found`)
  }

  successResponse(res, 'order retreived successfully', order);
}

exports.getCurrentUserOrders = async(req, res) => {
    const orders = await Order.find({user: req.user.userId});

    successResponse(res, 'Orders retrieved successfully', orders)
}
