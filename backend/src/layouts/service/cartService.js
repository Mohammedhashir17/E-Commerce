import Cart from '../db-operations/models/Cart.js';
import Product from '../db-operations/models/Product.js';

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  return cart;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();
  return await Cart.findById(cart._id).populate('items.product');
};

export const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();
  return await Cart.findById(cart._id).populate('items.product');
};

export const removeFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();
  return await Cart.findById(cart._id).populate('items.product');
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();
  return cart;
};

