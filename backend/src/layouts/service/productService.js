import Product from '../db-operations/models/Product.js';
import Category from '../db-operations/models/Category.js';

export const CATEGORY_ORDER = [
  'Jewellery & Accessories',
  'Toys & Kids Products',
  'Fragrances & Perfumes',
  'Home Decor & Decorative Items',
  'Watches & Timewear',
  'Bags & Travel Accessories',
];

export const getAllProducts = async (filters = {}) => {
  const { category, minPrice, maxPrice, search, brand, minRating, inStock } = filters;
  const query = {};

  if (category && CATEGORY_ORDER.includes(category)) {
    query.categoryName = category;
  } else {
    query.categoryName = { $in: CATEGORY_ORDER };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (brand) {
    query.brand = brand;
  }

  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  if (inStock === 'true' || inStock === true) {
    query.stock = { $gt: 0 };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(query).populate('category', 'name slug');
  return products;
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('category', 'name slug');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const getProductsByCategory = async (categoryName) => {
  if (!CATEGORY_ORDER.includes(categoryName)) {
    return [];
  }
  const products = await Product.find({ categoryName }).populate('category', 'name slug');
  return products;
};

export const getAllCategories = async () => {
  const categories = await Category.find({
    name: { $in: CATEGORY_ORDER },
  });

  const orderMap = CATEGORY_ORDER.reduce((acc, name, index) => {
    acc[name] = index;
    return acc;
  }, {});

  return categories
    .map((cat) => {
      const obj = cat.toObject();
      return {
        ...obj,
        orderIndex: orderMap[cat.name] ?? CATEGORY_ORDER.length,
      };
    })
    .sort((a, b) => a.orderIndex - b.orderIndex);
};

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const updateProduct = async (productId, productData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

