const Product = require("../models/product.model");

function parsePagination(req) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function parseSorting(req) {
  // Expected format: createdAt:desc | price:asc
  const raw = req.query.sorting || "createdAt:desc";
  const [field, orderRaw] = raw.split(":");
  const order = (orderRaw || "desc").toLowerCase() === "asc" ? 1 : -1;

  // Keep a small allowlist to avoid accidental injection via sort fields.
  const allowedFields = new Set(["createdAt", "updatedAt", "price", "stock", "name"]);
  const sortField = allowedFields.has(field) ? field : "createdAt";
  return { [sortField]: order };
}

function buildFilters(req) {
  const criteria = {};
  if (req.query.categoryId) criteria.categoryId = req.query.categoryId;

  if (req.query.q) {
    criteria.name = { $regex: String(req.query.q), $options: "i" };
  }

  const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined;
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    criteria.price = {};
    if (!Number.isNaN(minPrice)) criteria.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) criteria.price.$lte = maxPrice;
    // If both are NaN, remove empty object.
    if (Object.keys(criteria.price).length === 0) delete criteria.price;
  }

  return criteria;
}

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock } = req.body;
    if (!name || !description || price === undefined || categoryId === undefined) {
      return res.status(400).send({
        success: false,
        message: "Required fields: name, description, price, categoryId",
        data: {},
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      stock: stock === undefined ? 0 : stock,
    });

    return res.status(201).send({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while creating product",
      data: {},
    });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const sort = parseSorting(req);
    const filters = buildFilters(req);

    const [items, total] = await Promise.all([
      Product.find(filters).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filters),
    ]);

    return res.status(200).send({
      success: true,
      message: "Products fetched",
      data: {
        items,
        pagination: { page, limit, total },
      },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while fetching products",
      data: {},
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product not found",
        data: {},
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product fetched",
      data: product,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while fetching product",
      data: {},
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, categoryId, stock } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (categoryId !== undefined) update.categoryId = categoryId;
    if (stock !== undefined) update.stock = stock;

    const product = await Product.findOneAndUpdate({ productId }, update, { new: true });
    if (!product) {
      return res.status(400).send({
        success: false,
        message: "Product not found",
        data: {},
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product updated",
      data: product,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while updating product",
      data: {},
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.deleteOne({ productId });
    if (!deleted.deletedCount) {
      return res.status(400).send({
        success: false,
        message: "Product not found",
        data: {},
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product deleted",
      data: { deleted: true },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      data: {},
    });
  }
};

