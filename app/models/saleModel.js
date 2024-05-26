const mongoose = require("mongoose");

const saleSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
},
{timestamps: true}
)

const Sale = new mongoose.model("Sale", saleSchema);

module.exports = Sale;