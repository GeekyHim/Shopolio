const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
      index: true,
    },
    userId: { type: String, required: true, index: true },
    items: {
      type: [
        {
          productId: { type: String, required: true },
          quantity: { type: Number, required: true, min: 1 },
          price: { type: Number, required: true, min: 0 }, // snapshot price
        },
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
      required: true,
    },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);

