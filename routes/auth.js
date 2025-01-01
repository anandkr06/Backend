const User = require("../Models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
// register endpoint
router.post("/", async(req, res) => {
  // hash the password
  const { email, username, password, phone, isAdmin } = req.body;
  if (!email || !username || !password || !phone) {
    res.status(400).send({
      message: "Please provide all details"
    })
  }
  try {
    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({
        message: "Email already in use"
      });
    }

    // Check if the phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).send({
        message: "Phone number already in use"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and collect the data
    const user = new User({
      email,
      username,
      password: hashedPassword,
      phone,
      isAdmin
    });

    // Save the new user
    await user.save();

    // Return success if the new user is added to the database successfully
    return res.status(201).send({
      message: "User Created Successfully"
    });

  } catch (error) {
    // Catch any errors and respond with a generic error message
    return res.status(500).send({
      message: "Error creating user",
      error
    });
  }
});

module.exports = router;