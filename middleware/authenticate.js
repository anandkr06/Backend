const jwt = require("jsonwebtoken");
const user = require("../Models/User");

module.exports = async (req, res, next) => {
    try {
        //   get the token from the authorization header
        const token = await req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send({ message: "Unauthorized, Token Not Found" });
        }

        //check if the token matches the supposed origin
        const decoded = jwt.verify(token, process.env.JSON_TOKEN)
        const User = await user.findById(decoded.userId);
        if (!User) {
            return res.status(401).send({ message: "Unauthorized,User not found" });
        }

        // pass the user down to the endpoints here
        req.user = user;

        // pass down functionality to the endpoint
        next();

    } catch (error) {
        res.status(401).send({
            message: "Invalid request",
        });
    }
};
