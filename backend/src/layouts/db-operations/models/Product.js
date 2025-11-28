import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  brand: {
    type: String,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  offerPrice: {
    type: Number,
  },
  offerValidUntil: {
    type: Date,
  },
  hasOffer: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;

