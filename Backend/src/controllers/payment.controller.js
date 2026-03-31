const productModel = require("../models/product.model");
const paymentModel = require("../models/payment.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const product = await productModel.findOne();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const options = {
      amount: product.price.amount * 100, // convert to paise ✅
      currency: product.price.currency,
    };

    const order = await razorpay.orders.create(options);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      price: {
        amount: options.amount,
        currency: order.currency,
      },
      status: "PENDING",
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
      payment: newPayment,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


async function verifyPayment(req , res){

   const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET

  try {
    const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils.js')

    const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
    if (result) {
      const payment = await Payment.findOne({ orderId: razorpayOrderId });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = 'completed';
      await payment.save();
      res.json({ status: 'success' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
}
}

module.exports = { createOrder };
