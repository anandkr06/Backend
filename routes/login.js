const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                message: "Email not found"
            });
        }

        // Compare the password entered with the hashed password found
        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!passwordCheck) {
            return res.status(400).send({
                message: "Passwords do not match"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email,
            },
            process.env.JSON_TOKEN,
            { expiresIn: "24h" }
        );

        // Return success response
        res.status(200).send({
            message: "Login Successful",
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            token
        });

    } catch (error) {
        // Handle errors
        if (error.message.includes("Email not found")) {
            return res.status(404).send({
                message: "Email not found"
            });
        }
        res.status(500).send({
            message: "An error occurred during login",
            error
        });
    }
});

module.exports = router;
