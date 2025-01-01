var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const authenticate = require("../middleware/authenticate");
const crypto = require('crypto');
const OrderConfirmed = require('../Models/OrderConfirmed');
const ReferenceCounter = require("../Models/ReferenceCounter");

router.post('/', urlencodedParser, authenticate, async (req, res) => {
  try {
    if (
      !req.body.txnid ||
      !req.body.amount ||
      !req.body.productinfo ||
      !req.body.firstname ||
      !req.body.email ||
      !req.body.udf1
    ) {
      res.send('Mandatory fields missing');
    } else {
      var pd = req.body;
      var hashString =
        process.env.PAYMENT_KEY + // live or test key
        '|' +
        pd.txnid +
        '|' +
        pd.amount +
        '|' +
        pd.productinfo +
        '|' +
        pd.firstname +
        '|' +
        pd.email +
        '|' +
        pd.udf1 +
        '|' +
        pd.udf2 +
        '|||||||||' +
        process.env.SALT; //live or test salt
      var sha = new jsSHA('SHA-512', 'TEXT'); //encryption taking place
      sha.update(hashString);
      var hash = sha.getHash('HEX'); //hashvalue converted to hexvalue
      // Fetch the next reference number
      const referenceCounter = await ReferenceCounter.findOneAndUpdate(
        {},
        { $inc: { seq: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const referenceNumber = referenceCounter.seq || 1001;

      const newOrder = new OrderConfirmed({
        txnid: pd.txnid,
        referenceNumber,
        status: 'pending', // Set status as pending initially
        amount: pd.amount,
        productinfo: pd.productinfo,
        firstname: pd.firstname,
        lastname: "",
        email: pd.email,
        passengers: JSON.parse(pd.udf1), // Parse passengers from JSON string
        travellingDetails: JSON.parse(pd.udf2), // Parse travellingDetails from JSON string
      });
      await newOrder.save();
      res.send({ hash: hash });

    }
  } catch (error) {
    res.status(500).send({
      error
    });
  }
});

module.exports = router;