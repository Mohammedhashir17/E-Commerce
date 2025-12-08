import Wishlist from '../db-operations/models/Wishlist.js';

export const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  
  return wishlist;
};

export const addToWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return await Wishlist.findById(wishlist._id).populate('products');
};

export const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  
  if (!wishlist) {
    throw new Error('Wishlist not found');
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  return await Wishlist.findById(wishlist._id).populate('products');
};

