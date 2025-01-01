const express = require('express');
const router = express.Router();
const OrderConfirmed = require('../Models/OrderConfirmed');
const authenticate = require("../middleware/authenticate");
const authenticateAdmin = require('../middleware/authenticateAdmin');

// Route to fetch ticket data based on txnId
router.get('/', authenticate , async (req, res) => {
  const { txnid } = req.query;

  try {
    // Find the order with the given txnId
    const order = await OrderConfirmed.findOne({ txnid: txnid });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Send the order details as a JSON response
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the order.' });
  }
});

router.get('/all',authenticateAdmin, async (req, res) => {
  try {
    // Fetch all tickets from the OrderConfirmed collection
    const orders = await OrderConfirmed.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No tickets found.' });
    }

    // Send the list of tickets as a JSON response
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching tickets.' });
  }
});

module.exports = router;
