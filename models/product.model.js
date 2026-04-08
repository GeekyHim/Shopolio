const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    categoryId: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);

