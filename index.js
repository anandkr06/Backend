

const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const config = require("config");
require('dotenv').config();

var cors = require('cors');

const app = express();


//connect DB
const connectDB = async () => {
  try {
    console.log(process.env.URI)
    await mongoose.connect(process.env.URI);

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("mongo eroor:", err.message);
    process.exit(1);
  }
};
connectDB(); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.use('/api/payment', require('./routes/payment.js'));
app.use('/api/test', require('./routes/test.js'));
app.use('/api/testFailure',require('./routes/testFailure.js'));
app.use('/api/signup',require('./routes/auth.js'));
app.use("/api/login",require("./routes/login.js"));
app.use("/api/getTicketData",require("./routes/getTicketData.js"));
app.use("/api/getTicketData",require("./routes/getTicketData.js"));
app.use("/api",require("./routes/updatePassenger.js"));


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));