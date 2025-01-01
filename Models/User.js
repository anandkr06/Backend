const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "confirmed_orders",
        }
    ],
},
    { timestamps: true }
)
module.exports = mongoose.model("User",UserSchema)