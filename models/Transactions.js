const mongoose = require("mongoose");

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  type: {
    type: String,
    trim: true,
    required: [true, "Please add expense type"],
  },
  amount: {
    type: Number,
    required: [true, "Please add expense"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
