const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
})

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;