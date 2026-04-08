const Order = require("../models/order.model");
const Product = require("../models/product.model");

function parsePagination(req) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function parseSorting(req) {
  const raw = req.query.sorting || "createdAt:desc";
  const [field, orderRaw] = raw.split(":");
  const order = (orderRaw || "desc").toLowerCase() === "asc" ? 1 : -1;

  const allowedFields = new Set(["createdAt", "updatedAt", "total", "status"]);
  const sortField = allowedFields.has(field) ? field : "createdAt";
  return { [sortField]: order };
}

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length < 1) {
      return res.status(400).send({
        success: false,
        message: "Required body: items[]",
        data: {},
      });
    }

    const preparedItems = [];
    let total = 0;

    for (const item of items) {
      const { productId, quantity } = item || {};
      const qty = Number(quantity);

      if (!productId || !Number.isFinite(qty) || qty < 1) {
        return res.status(400).send({
          success: false,
          message: "Each item must contain productId and quantity (>= 1)",
          data: {},
        });
      }

      const product = await Product.findOne({ productId });
      if (!product) {
        return res.status(400).send({
          success: false,
          message: `Product not found: ${productId}`,
          data: {},
        });
      }

      const price = Number(product.price);
      total += price * qty;
      preparedItems.push({ productId, quantity: qty, price });
    }

    const order = await Order.create({
      userId: req.user.userId,
      items: preparedItems,
      total,
      status: "PLACED",
    });

    return res.status(201).send({
      success: true,
      message: "Order created",
      data: order,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while creating order",
      data: {},
    });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSorting(req);
    const status = req.query.status;

    const filters = {};
    if (status) filters.status = status;
    if (req.user.userType !== "ADMIN") filters.userId = req.user.userId;

    const [items, total] = await Promise.all([
      Order.find(filters).sort(sort).skip(skip).limit(limit),
      Order.countDocuments(filters),
    ]);

    return res.status(200).send({
      success: true,
      message: "Orders fetched",
      data: {
        items,
        pagination: { page, limit, total },
      },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while fetching orders",
      data: {},
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(400).send({
        success: false,
        message: "Order not found",
        data: {},
      });
    }

    if (req.user.userType !== "ADMIN" && order.userId !== req.user.userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: cannot access this order",
        data: {},
      });
    }

    return res.status(200).send({
      success: true,
      message: "Order fetched",
      data: order,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while fetching order",
      data: {},
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body || {};

    const allowed = new Set(["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"]);
    if (!status || !allowed.has(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status",
        data: {},
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(400).send({
        success: false,
        message: "Order not found",
        data: {},
      });
    }

    return res.status(200).send({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while updating order status",
      data: {},
    });
  }
};

