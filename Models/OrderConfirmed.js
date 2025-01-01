const mongoose = require("mongoose");

const PassengerSchema = mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: false }, // Date of birth
  nationality: { type: String, required: false },
});
const TravellingDetailsSchema = mongoose.Schema({
  from: { type: String, required: true }, // Departure location
  to: { type: String, required: true },   // Arrival location
  departureDate: { type: Date, required: true }, // Departure date
  returnDate: { type: Date }, // Optional return date for round-trip
  tripType: { type: String, enum: ['one Way', 'Round Trip'], required: true }, // Trip type
});
const OrderConfirmSchema = mongoose.Schema(
  {
    txnid: { type: String, required: true },
    referenceNumber: { type: Number, required: true, unique: true }, // Incremental reference number
    status: { type: String, required: true },
    amount: { type: String, required: true },
    productinfo: { type: String },
    firstname: { type: String },
    email: {type: String},
    lastname: { type: String },
    passengers: [PassengerSchema],
    travellingDetails: TravellingDetailsSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("confirmed_orders", OrderConfirmSchema);
