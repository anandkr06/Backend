const mongoose = require("mongoose");

const referenceCounterSchema = mongoose.Schema({
  seq: { type: Number, required: true },
});

module.exports = mongoose.model("ReferenceCounter", referenceCounterSchema);
