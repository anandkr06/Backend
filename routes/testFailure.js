

var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const OrderConfirmed = require('../Models/OrderConfirmed');



// To verify the payment and update the order status in case of failure
router.post('/', async (req, res) => {
  try {

    // Find the order by txnid
    const order = await OrderConfirmed.findOne({ txnid: req.body.txnid });

    // If the order exists and the payment status is 'failure', update the status to 'failed'
    if (order && req.body.status === 'failure') {
      await OrderConfirmed.findOneAndUpdate(
        { txnid: req.body.txnid },
        { status: 'failed', error_Message: req.body.error || "Payment failed" }, // Mark the payment as failed
        { new: true }
      );
      


      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Success</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; }
              h1 { color: #FF0000; }
              p { font-size: 16px; color: #333; }
              .order-details { margin-top: 20px; }
              .order-details p { font-weight: bold; }
              .thank-you { margin-top: 30px; font-size: 18px; color: #4CAF50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Payment Failed</h1>
              <p>Your order has been failed. Below are the details:</p>
              
              <div class="order-details">
                <p><strong>Transaction ID:</strong> ${req.body.txnid}</p>
                <p><strong>Amount:</strong> ${req.body.amount}</p>
                <p><strong>Name:</strong> ${req.body.firstname} ${order.lastname}</p>
              </div>

              <div class="thank-you">
                <p>Thank you for your purchase! You'll receive a confirmation email shortly.</p>
              </div>
            </div>
          </body>
        </html>
      `)
    } else if (!order) {
      res.status(404).send({
        status: 'failure',
        message: `Order with transaction ID: ${req.body.txnid} not found.`,
      });
    } else {
      res.status(400).send({
        status: 'failure',
        message: 'Order was not found or payment status does not match.',
      });
    }
  } catch (err) {
    res.status(500).send('An error occurred while processing the payment failure');
  }
});

module.exports = router;
