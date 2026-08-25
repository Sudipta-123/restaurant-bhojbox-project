const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  item: String,
  quantity: String,
  address: String,

  paymentType: String, 
  upiApp: String,      
  amount: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);