import Order from '../db-operations/models/Order.js';
import Cart from '../db-operations/models/Cart.js';
import Product from '../db-operations/models/Product.js';

export const createOrder = async (userId, shippingAddress, paymentMethod) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
    image: item.product.image,
  }));

  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = itemsPrice * 0.18;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  await clearCart(userId);

  return await Order.findById(order._id).populate('user', 'name email').populate('orderItems.product');
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email')
    .populate('orderItems.product');
  
  if (!order) {
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== userId.toString()) {
    throw new Error('Not authorized to view this order');
  }

  return order;
};

export const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('orderItems.product')
    .sort({ createdAt: -1 });
  return orders;
};

export const updateOrderToPaid = async (orderId, paymentResult) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = paymentResult;
  order.razorpayPaymentId = paymentResult.id;

  await order.save();
  return order;
};

export const updateOrderToDelivered = async (orderId) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();
  return order;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
};

