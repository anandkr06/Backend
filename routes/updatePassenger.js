const express = require('express');
const router = express.Router();
const OrderConfirmed = require('../Models/OrderConfirmed');
const authenticateAdmin = require('../middleware/authenticateAdmin');


router.post('/updatepassengers/:id',authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const updatedPassengerDetails = req.body; // Expect updated details in the request body

    try {
        // Find the order by ID and update the specific passenger
        const order = await OrderConfirmed.findOneAndUpdate(
            { _id: id }, // Find the order with matching passenger
            { 
                $set: {
                    'passengers': updatedPassengerDetails, // Update specific passenger
                } 
            }
        );

        if (!order) {
            return res.status(404).send({ message: 'Order or Passenger not found' });
        }

        res.status(200).send({ message: 'Passenger updated successfully', order });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error });
    }
});

module.exports = router;