const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})

const User = new mongoose.model("User", userSchema);

module.exports = User;