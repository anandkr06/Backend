

var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const OrderConfirmed = require('../Models/OrderConfirmed');
const nodemailer = require('nodemailer');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  auth: {
    user: 'araj250101@gmail.com', // your email
    pass: 'pacp vtvu bzgf amlo',    // your email password or app password
  },
});

// To verify the payment and update the order status
router.post('/', async (req, res) => {
  try {

    // Find the order by txnid
    const order = await OrderConfirmed.findOne({ txnid: req.body.txnid });
    // If the order exists and the payment status is 'success', update the status to 'paid'
    if (order) {
      await OrderConfirmed.findOneAndUpdate(
        { txnid: req.body.txnid },
        { status: 'paid' }
      );
      // Send confirmation email with ticket details
      const mailOptions = {
        from: 'araj250101@example.com', // sender address
        to: order.email,                // user's email from the order
        subject: 'Order Confirmation and Ticket Download Link',
        html: `
          <h1>Payment Successful</h1>
          <p>Dear ${req.body.firstname} ${order.lastname},</p>
          <p>Thank you for your payment. Here are the details of your order:</p>
          <ul>
            <li><strong>Transaction ID:</strong> ${req.body.txnid}</li>
            <li><strong>Amount:</strong> ${req.body.amount}</li>
            <li><strong>Name:</strong> ${req.body.firstname} ${order.lastname}</li>
          </ul>
          <a href="http://localhost:3000/downloadTicket?txnId=${req.body.txnid}" class="download-button">Download PDF</a>
          <p>Thank you for your purchase!</p>
        `,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        } else {
        }
      });

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
              h1 { color: #4CAF50; }
              p { font-size: 16px; color: #333; }
              .order-details { margin-top: 20px; }
              .order-details p { font-weight: bold; }
              .thank-you { margin-top: 30px; font-size: 18px; color: #4CAF50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Payment Successful</h1>
              <p>Your order has been successfully paid. Below are the details:</p>
              
              <div class="order-details">
                <p><strong>Transaction ID:</strong> ${req.body.txnid}</p>
                <p><strong>Amount:</strong> ${req.body.amount}</p>
                <p><strong>Name:</strong> ${req.body.firstname} ${order.lastname}</p>
              </div>

              <div class="thank-you">
                <p>Thank you for your purchase! You'll receive a confirmation email shortly.</p>
              </div>
              <a href="http://localhost:3000/downloadTicket?txnId=${req.body.txnid}" class="download-button">Download PDF</a>
            </div>
          </body>
        </html>
      `);
    } else if (!order) {
      res.status(404).send({
        status: 'failure',
        message: `Order with transaction ID: ${req.body.txnid} not found.`,
      });
    } else {
      res.status(400).send({
        status: 'failure',
        message: 'Payment was not successful. Please try again.',
      });
    }
  } catch (err) {
    res.status(500).send('An error occurred while processing the payment');
  }
});

module.exports = router;
