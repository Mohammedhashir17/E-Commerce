// Seed script to populate initial categories and products
// Run with: node src/layouts/db-operations/seed.js

import dotenv from 'dotenv';
import connectDB from './db-connection.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
  { name: 'Fashion & Clothing', slug: 'fashion-clothing', description: 'Fashion and apparel' },
  { name: 'Home & Furniture', slug: 'home-furniture', description: 'Home and furniture essentials' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Beauty and personal care products' },
  { name: 'Toys & Baby Products', slug: 'toys-baby-products', description: 'Toys and baby products' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports and fitness equipment' },
  { name: 'Books & Stationary', slug: 'books-stationary', description: 'Books and stationary items' },
  { name: 'Gaming', slug: 'gaming', description: 'Gaming consoles, accessories and games' },
];

// Generate 25+ products for each category
const generateProducts = () => {
  const allProducts = [];

  // Electronics - 30 products
  const electronicsProducts = [
    { name: 'iPhone 15 Pro Max', price: 134900, brand: 'Apple', rating: 4.8, stock: 50, numReviews: 250 },
    { name: 'Samsung Galaxy S24 Ultra', price: 124999, brand: 'Samsung', rating: 4.7, stock: 45, numReviews: 200 },
    { name: 'MacBook Pro 16" M3', price: 249900, brand: 'Apple', rating: 4.9, stock: 30, numReviews: 180 },
    { name: 'Dell XPS 15 Laptop', price: 149999, brand: 'Dell', rating: 4.6, stock: 25, numReviews: 150 },
    { name: 'Sony WH-1000XM5 Headphones', price: 28990, brand: 'Sony', rating: 4.8, stock: 60, numReviews: 320 },
    { name: 'AirPods Pro 2', price: 24900, brand: 'Apple', rating: 4.7, stock: 100, numReviews: 500 },
    { name: 'iPad Air 11"', price: 59900, brand: 'Apple', rating: 4.6, stock: 40, numReviews: 220 },
    { name: 'Samsung 55" QLED TV', price: 89999, brand: 'Samsung', rating: 4.5, stock: 20, numReviews: 180 },
    { name: 'LG OLED 65" TV', price: 149999, brand: 'LG', rating: 4.7, stock: 15, numReviews: 150 },
    { name: 'Canon EOS R6 Camera', price: 199999, brand: 'Canon', rating: 4.8, stock: 10, numReviews: 120 },
    { name: 'Nikon D850 DSLR', price: 249999, brand: 'Nikon', rating: 4.7, stock: 8, numReviews: 100 },
    { name: 'GoPro Hero 12', price: 44900, brand: 'GoPro', rating: 4.6, stock: 35, numReviews: 200 },
    { name: 'DJI Mini 4 Pro Drone', price: 109999, brand: 'DJI', rating: 4.8, stock: 12, numReviews: 90 },
    { name: 'Kindle Paperwhite', price: 13999, brand: 'Amazon', rating: 4.5, stock: 80, numReviews: 400 },
    { name: 'Fitbit Charge 6', price: 14999, brand: 'Fitbit', rating: 4.4, stock: 70, numReviews: 300 },
    { name: 'Apple Watch Series 9', price: 41900, brand: 'Apple', rating: 4.7, stock: 50, numReviews: 250 },
    { name: 'Samsung Galaxy Watch 6', price: 29999, brand: 'Samsung', rating: 4.5, stock: 45, numReviews: 200 },
    { name: 'JBL Flip 6 Speaker', price: 8999, brand: 'JBL', rating: 4.3, stock: 90, numReviews: 180 },
    { name: 'Bose QuietComfort 45', price: 32990, brand: 'Bose', rating: 4.6, stock: 40, numReviews: 220 },
    { name: 'Logitech MX Master 3S Mouse', price: 8999, brand: 'Logitech', rating: 4.7, stock: 100, numReviews: 350 },
    { name: 'Mechanical Keyboard RGB', price: 12999, brand: 'Corsair', rating: 4.5, stock: 60, numReviews: 280 },
    { name: 'Webcam 4K Pro', price: 14999, brand: 'Logitech', rating: 4.4, stock: 55, numReviews: 200 },
    { name: 'External SSD 1TB', price: 8999, brand: 'Samsung', rating: 4.6, stock: 75, numReviews: 400 },
    { name: 'USB-C Hub 8-in-1', price: 2999, brand: 'Anker', rating: 4.3, stock: 120, numReviews: 500 },
    { name: 'Wireless Charging Pad', price: 1999, brand: 'Anker', rating: 4.2, stock: 150, numReviews: 600 },
    { name: 'Power Bank 20000mAh', price: 2499, brand: 'Anker', rating: 4.5, stock: 100, numReviews: 450 },
    { name: 'Smart Doorbell Camera', price: 12999, brand: 'Ring', rating: 4.4, stock: 40, numReviews: 180 },
    { name: 'Smart Thermostat', price: 14999, brand: 'Nest', rating: 4.5, stock: 30, numReviews: 150 },
    { name: 'Robot Vacuum Cleaner', price: 34999, brand: 'iRobot', rating: 4.6, stock: 25, numReviews: 200 },
    { name: 'Smart Light Bulbs Pack', price: 2999, brand: 'Philips Hue', rating: 4.3, stock: 80, numReviews: 300 },
  ];

  // Fashion & Clothing - 30 products
  const fashionProducts = [
    { name: 'Men\'s Cotton T-Shirt Pack', price: 1299, brand: 'H&M', rating: 4.2, stock: 200, numReviews: 500 },
    { name: 'Women\'s Summer Dress', price: 2499, brand: 'Zara', rating: 4.5, stock: 150, numReviews: 400 },
    { name: 'Denim Jeans Classic Fit', price: 2999, brand: 'Levi\'s', rating: 4.4, stock: 180, numReviews: 450 },
    { name: 'Leather Jacket', price: 8999, brand: 'Zara', rating: 4.6, stock: 50, numReviews: 200 },
    { name: 'Running Shoes', price: 4999, brand: 'Nike', rating: 4.7, stock: 120, numReviews: 600 },
    { name: 'Casual Sneakers', price: 3999, brand: 'Adidas', rating: 4.5, stock: 150, numReviews: 500 },
    { name: 'Formal Shirt', price: 1999, brand: 'Van Heusen', rating: 4.3, stock: 100, numReviews: 300 },
    { name: 'Winter Coat', price: 5999, brand: 'H&M', rating: 4.4, stock: 80, numReviews: 250 },
    { name: 'Sunglasses Aviator', price: 2999, brand: 'Ray-Ban', rating: 4.6, stock: 60, numReviews: 350 },
    { name: 'Wristwatch Classic', price: 4999, brand: 'Fossil', rating: 4.5, stock: 40, numReviews: 200 },
    { name: 'Backpack Travel', price: 3499, brand: 'Nike', rating: 4.4, stock: 90, numReviews: 280 },
    { name: 'Handbag Leather', price: 5999, brand: 'Zara', rating: 4.5, stock: 70, numReviews: 320 },
    { name: 'Belt Genuine Leather', price: 1999, brand: 'H&M', rating: 4.2, stock: 120, numReviews: 400 },
    { name: 'Socks Pack 6 Pairs', price: 499, brand: 'Nike', rating: 4.3, stock: 300, numReviews: 600 },
    { name: 'Underwear Pack 3', price: 799, brand: 'Calvin Klein', rating: 4.4, stock: 250, numReviews: 500 },
    { name: 'Kurta Set', price: 2499, brand: 'Fabindia', rating: 4.5, stock: 100, numReviews: 350 },
    { name: 'Saree Silk', price: 4999, brand: 'Manyavar', rating: 4.6, stock: 50, numReviews: 200 },
    { name: 'Kurti Cotton', price: 999, brand: 'Fabindia', rating: 4.3, stock: 180, numReviews: 450 },
    { name: 'Palazzo Pants', price: 1499, brand: 'H&M', rating: 4.2, stock: 120, numReviews: 300 },
    { name: 'Leggings Pack 2', price: 799, brand: 'Nike', rating: 4.4, stock: 200, numReviews: 500 },
    { name: 'Hoodie Pullover', price: 2499, brand: 'Nike', rating: 4.5, stock: 150, numReviews: 400 },
    { name: 'Track Pants', price: 1999, brand: 'Adidas', rating: 4.3, stock: 130, numReviews: 350 },
    { name: 'Swimwear Bikini', price: 2999, brand: 'Speedo', rating: 4.4, stock: 60, numReviews: 180 },
    { name: 'Flip Flops', price: 499, brand: 'Havaianas', rating: 4.2, stock: 250, numReviews: 600 },
    { name: 'Sandals Leather', price: 1999, brand: 'H&M', rating: 4.3, stock: 100, numReviews: 280 },
    { name: 'Formal Shoes', price: 3999, brand: 'Hush Puppies', rating: 4.5, stock: 80, numReviews: 250 },
    { name: 'Tie Silk', price: 999, brand: 'Van Heusen', rating: 4.2, stock: 150, numReviews: 400 },
    { name: 'Cufflinks Set', price: 1999, brand: 'Fossil', rating: 4.4, stock: 50, numReviews: 150 },
    { name: 'Wallet Leather', price: 1499, brand: 'H&M', rating: 4.3, stock: 90, numReviews: 300 },
    { name: 'Scarf Wool', price: 999, brand: 'Zara', rating: 4.2, stock: 120, numReviews: 350 },
  ];

  // Home & Furniture - 30 products
  const homeProducts = [
    { name: 'Sofa 3 Seater', price: 24999, brand: 'IKEA', rating: 4.5, stock: 20, numReviews: 150 },
    { name: 'Dining Table 6 Seater', price: 19999, brand: 'IKEA', rating: 4.4, stock: 15, numReviews: 120 },
    { name: 'Bed Frame Queen', price: 14999, brand: 'IKEA', rating: 4.6, stock: 25, numReviews: 180 },
    { name: 'Mattress Memory Foam', price: 29999, brand: 'Sleepwell', rating: 4.7, stock: 30, numReviews: 250 },
    { name: 'Wardrobe 4 Door', price: 34999, brand: 'IKEA', rating: 4.5, stock: 12, numReviews: 100 },
    { name: 'Coffee Table', price: 8999, brand: 'IKEA', rating: 4.3, stock: 40, numReviews: 200 },
    { name: 'Bookshelf 5 Tier', price: 6999, brand: 'IKEA', rating: 4.4, stock: 50, numReviews: 180 },
    { name: 'TV Stand', price: 12999, brand: 'IKEA', rating: 4.5, stock: 35, numReviews: 150 },
    { name: 'Office Chair Ergonomic', price: 8999, brand: 'IKEA', rating: 4.6, stock: 60, numReviews: 300 },
    { name: 'Dining Chairs Set 4', price: 7999, brand: 'IKEA', rating: 4.3, stock: 45, numReviews: 200 },
    { name: 'Study Table', price: 9999, brand: 'IKEA', rating: 4.4, stock: 40, numReviews: 180 },
    { name: 'Bean Bag Large', price: 4999, brand: 'IKEA', rating: 4.2, stock: 80, numReviews: 250 },
    { name: 'Curtains Set', price: 2999, brand: 'IKEA', rating: 4.3, stock: 100, numReviews: 300 },
    { name: 'Rug 6x4 Feet', price: 3999, brand: 'IKEA', rating: 4.4, stock: 70, numReviews: 200 },
    { name: 'Lamp Table', price: 1999, brand: 'IKEA', rating: 4.2, stock: 90, numReviews: 350 },
    { name: 'Wall Clock', price: 999, brand: 'IKEA', rating: 4.1, stock: 150, numReviews: 400 },
    { name: 'Mirror Wall', price: 4999, brand: 'IKEA', rating: 4.3, stock: 50, numReviews: 180 },
    { name: 'Cushions Set 4', price: 1999, brand: 'IKEA', rating: 4.2, stock: 120, numReviews: 300 },
    { name: 'Bed Sheets Set', price: 1499, brand: 'IKEA', rating: 4.3, stock: 200, numReviews: 500 },
    { name: 'Pillows Set 2', price: 999, brand: 'Sleepwell', rating: 4.4, stock: 180, numReviews: 400 },
    { name: 'Kitchen Knife Set', price: 2999, brand: 'Prestige', rating: 4.5, stock: 80, numReviews: 250 },
    { name: 'Cookware Set 10 Pcs', price: 4999, brand: 'Prestige', rating: 4.6, stock: 60, numReviews: 200 },
    { name: 'Dinner Set 24 Pcs', price: 3999, brand: 'Corelle', rating: 4.4, stock: 70, numReviews: 300 },
    { name: 'Coffee Maker', price: 3499, brand: 'Prestige', rating: 4.3, stock: 90, numReviews: 350 },
    { name: 'Blender Mixer', price: 2499, brand: 'Prestige', rating: 4.4, stock: 100, numReviews: 400 },
    { name: 'Microwave Oven', price: 8999, brand: 'LG', rating: 4.5, stock: 40, numReviews: 200 },
    { name: 'Air Fryer', price: 5999, brand: 'Prestige', rating: 4.6, stock: 50, numReviews: 250 },
    { name: 'Rice Cooker', price: 1999, brand: 'Prestige', rating: 4.3, stock: 120, numReviews: 400 },
    { name: 'Water Purifier', price: 12999, brand: 'Kent', rating: 4.5, stock: 30, numReviews: 180 },
    { name: 'Vacuum Cleaner', price: 7999, brand: 'Eureka', rating: 4.4, stock: 45, numReviews: 220 },
  ];

  // Beauty & Personal Care - 30 products
  const beautyProducts = [
    { name: 'Face Moisturizer', price: 799, brand: 'Cetaphil', rating: 4.5, stock: 200, numReviews: 500 },
    { name: 'Sunscreen SPF 50', price: 599, brand: 'Neutrogena', rating: 4.6, stock: 180, numReviews: 450 },
    { name: 'Face Wash', price: 399, brand: 'Cetaphil', rating: 4.4, stock: 250, numReviews: 600 },
    { name: 'Serum Vitamin C', price: 1299, brand: 'The Ordinary', rating: 4.7, stock: 150, numReviews: 400 },
    { name: 'Face Mask Clay', price: 499, brand: 'L\'Oreal', rating: 4.3, stock: 200, numReviews: 350 },
    { name: 'Lipstick Set 6', price: 1999, brand: 'Maybelline', rating: 4.5, stock: 120, numReviews: 500 },
    { name: 'Foundation', price: 899, brand: 'L\'Oreal', rating: 4.4, stock: 180, numReviews: 450 },
    { name: 'Mascara', price: 599, brand: 'Maybelline', rating: 4.6, stock: 200, numReviews: 600 },
    { name: 'Eyeliner', price: 299, brand: 'Maybelline', rating: 4.3, stock: 250, numReviews: 500 },
    { name: 'Blush', price: 499, brand: 'Maybelline', rating: 4.4, stock: 150, numReviews: 300 },
    { name: 'Highlighter', price: 699, brand: 'Maybelline', rating: 4.5, stock: 120, numReviews: 280 },
    { name: 'Eyeshadow Palette', price: 1499, brand: 'Maybelline', rating: 4.6, stock: 100, numReviews: 400 },
    { name: 'Shampoo', price: 299, brand: 'Pantene', rating: 4.3, stock: 300, numReviews: 700 },
    { name: 'Conditioner', price: 299, brand: 'Pantene', rating: 4.4, stock: 280, numReviews: 650 },
    { name: 'Hair Serum', price: 499, brand: 'L\'Oreal', rating: 4.5, stock: 200, numReviews: 450 },
    { name: 'Hair Mask', price: 599, brand: 'L\'Oreal', rating: 4.4, stock: 150, numReviews: 350 },
    { name: 'Body Lotion', price: 399, brand: 'Nivea', rating: 4.3, stock: 250, numReviews: 500 },
    { name: 'Body Wash', price: 299, brand: 'Dove', rating: 4.4, stock: 300, numReviews: 600 },
    { name: 'Deodorant', price: 199, brand: 'Nivea', rating: 4.2, stock: 400, numReviews: 800 },
    { name: 'Perfume Men', price: 2999, brand: 'Axe', rating: 4.5, stock: 100, numReviews: 300 },
    { name: 'Perfume Women', price: 2999, brand: 'Victoria\'s Secret', rating: 4.6, stock: 120, numReviews: 350 },
    { name: 'Face Toner', price: 499, brand: 'The Ordinary', rating: 4.4, stock: 180, numReviews: 400 },
    { name: 'Cleansing Oil', price: 699, brand: 'The Ordinary', rating: 4.5, stock: 150, numReviews: 300 },
    { name: 'Exfoliating Scrub', price: 599, brand: 'Neutrogena', rating: 4.3, stock: 200, numReviews: 400 },
    { name: 'Eye Cream', price: 999, brand: 'Olay', rating: 4.4, stock: 130, numReviews: 280 },
    { name: 'Nail Polish Set 6', price: 999, brand: 'Maybelline', rating: 4.3, stock: 180, numReviews: 350 },
    { name: 'Makeup Remover', price: 399, brand: 'Neutrogena', rating: 4.4, stock: 200, numReviews: 450 },
    { name: 'Face Primer', price: 699, brand: 'Maybelline', rating: 4.5, stock: 150, numReviews: 300 },
    { name: 'Setting Spray', price: 599, brand: 'Maybelline', rating: 4.4, stock: 140, numReviews: 250 },
    { name: 'Brow Pencil', price: 299, brand: 'Maybelline', rating: 4.3, stock: 200, numReviews: 400 },
  ];

  // Toys & Baby Products - 30 products
  const toysProducts = [
    { name: 'LEGO City Set', price: 2999, brand: 'LEGO', rating: 4.8, stock: 80, numReviews: 400 },
    { name: 'Barbie Dreamhouse', price: 4999, brand: 'Mattel', rating: 4.7, stock: 50, numReviews: 300 },
    { name: 'Remote Control Car', price: 1999, brand: 'Hot Wheels', rating: 4.5, stock: 120, numReviews: 500 },
    { name: 'Action Figure Set', price: 1499, brand: 'Marvel', rating: 4.6, stock: 100, numReviews: 450 },
    { name: 'Puzzle 1000 Pieces', price: 999, brand: 'Ravensburger', rating: 4.4, stock: 150, numReviews: 350 },
    { name: 'Board Game Monopoly', price: 1999, brand: 'Hasbro', rating: 4.5, stock: 90, numReviews: 400 },
    { name: 'Building Blocks Set', price: 1499, brand: 'LEGO', rating: 4.7, stock: 110, numReviews: 500 },
    { name: 'Doll House', price: 3999, brand: 'Barbie', rating: 4.6, stock: 40, numReviews: 200 },
    { name: 'Toy Train Set', price: 2499, brand: 'Fisher-Price', rating: 4.5, stock: 60, numReviews: 250 },
    { name: 'Stuffed Animal Bear', price: 799, brand: 'Teddy', rating: 4.3, stock: 200, numReviews: 600 },
    { name: 'Baby Stroller', price: 8999, brand: 'Graco', rating: 4.6, stock: 30, numReviews: 180 },
    { name: 'Baby Car Seat', price: 6999, brand: 'Graco', rating: 4.7, stock: 25, numReviews: 150 },
    { name: 'Baby High Chair', price: 4999, brand: 'Graco', rating: 4.5, stock: 40, numReviews: 200 },
    { name: 'Baby Crib', price: 14999, brand: 'Graco', rating: 4.6, stock: 20, numReviews: 120 },
    { name: 'Baby Monitor', price: 3999, brand: 'Motorola', rating: 4.4, stock: 50, numReviews: 250 },
    { name: 'Baby Bottles Set 6', price: 999, brand: 'Philips Avent', rating: 4.5, stock: 100, numReviews: 400 },
    { name: 'Baby Diapers Pack', price: 799, brand: 'Pampers', rating: 4.3, stock: 300, numReviews: 800 },
    { name: 'Baby Wipes Pack', price: 499, brand: 'Pampers', rating: 4.4, stock: 400, numReviews: 900 },
    { name: 'Baby Clothes Set', price: 1499, brand: 'Carter\'s', rating: 4.5, stock: 150, numReviews: 350 },
    { name: 'Baby Toys Rattle', price: 299, brand: 'Fisher-Price', rating: 4.2, stock: 250, numReviews: 500 },
    { name: 'Baby Walker', price: 2999, brand: 'Fisher-Price', rating: 4.4, stock: 60, numReviews: 280 },
    { name: 'Baby Swing', price: 4999, brand: 'Fisher-Price', rating: 4.5, stock: 35, numReviews: 200 },
    { name: 'Baby Bouncer', price: 3999, brand: 'Fisher-Price', rating: 4.4, stock: 40, numReviews: 180 },
    { name: 'Baby Play Mat', price: 1999, brand: 'Fisher-Price', rating: 4.3, stock: 80, numReviews: 300 },
    { name: 'Baby Feeding Set', price: 1499, brand: 'Philips Avent', rating: 4.5, stock: 90, numReviews: 350 },
    { name: 'Baby Bath Tub', price: 999, brand: 'Fisher-Price', rating: 4.4, stock: 100, numReviews: 400 },
    { name: 'Baby Thermometer', price: 599, brand: 'Braun', rating: 4.6, stock: 120, numReviews: 450 },
    { name: 'Baby Nail Clipper Set', price: 299, brand: 'Pigeon', rating: 4.3, stock: 200, numReviews: 500 },
    { name: 'Baby Shampoo', price: 399, brand: 'Johnson\'s', rating: 4.4, stock: 250, numReviews: 600 },
    { name: 'Baby Lotion', price: 399, brand: 'Johnson\'s', rating: 4.5, stock: 240, numReviews: 580 },
  ];

  // Sports & Fitness - 30 products
  const sportsProducts = [
    { name: 'Yoga Mat Premium', price: 1299, brand: 'Liforme', rating: 4.6, stock: 150, numReviews: 400 },
    { name: 'Dumbbells Set 20kg', price: 2999, brand: 'Decathlon', rating: 4.5, stock: 80, numReviews: 300 },
    { name: 'Resistance Bands Set', price: 999, brand: 'Decathlon', rating: 4.4, stock: 200, numReviews: 500 },
    { name: 'Treadmill Electric', price: 29999, brand: 'Cult.fit', rating: 4.7, stock: 15, numReviews: 100 },
    { name: 'Exercise Bike', price: 19999, brand: 'Cult.fit', rating: 4.6, stock: 20, numReviews: 120 },
    { name: 'Pull Up Bar', price: 1999, brand: 'Decathlon', rating: 4.5, stock: 100, numReviews: 350 },
    { name: 'Kettlebell 16kg', price: 2499, brand: 'Decathlon', rating: 4.4, stock: 90, numReviews: 280 },
    { name: 'Foam Roller', price: 999, brand: 'Decathlon', rating: 4.3, stock: 150, numReviews: 400 },
    { name: 'Jump Rope', price: 299, brand: 'Decathlon', rating: 4.2, stock: 300, numReviews: 600 },
    { name: 'Yoga Blocks Set 2', price: 599, brand: 'Liforme', rating: 4.3, stock: 180, numReviews: 350 },
    { name: 'Yoga Strap', price: 399, brand: 'Liforme', rating: 4.2, stock: 200, numReviews: 400 },
    { name: 'Pilates Ball', price: 799, brand: 'Decathlon', rating: 4.4, stock: 120, numReviews: 300 },
    { name: 'Ankle Weights Set', price: 1499, brand: 'Decathlon', rating: 4.3, stock: 100, numReviews: 250 },
    { name: 'Wrist Weights', price: 999, brand: 'Decathlon', rating: 4.2, stock: 150, numReviews: 300 },
    { name: 'Gym Gloves', price: 599, brand: 'Decathlon', rating: 4.4, stock: 200, numReviews: 450 },
    { name: 'Water Bottle 1L', price: 499, brand: 'Nike', rating: 4.3, stock: 300, numReviews: 600 },
    { name: 'Gym Bag', price: 1999, brand: 'Nike', rating: 4.5, stock: 120, numReviews: 350 },
    { name: 'Sports Bra', price: 1299, brand: 'Nike', rating: 4.4, stock: 180, numReviews: 400 },
    { name: 'Running Shorts', price: 999, brand: 'Nike', rating: 4.3, stock: 200, numReviews: 450 },
    { name: 'Compression Tights', price: 1999, brand: 'Nike', rating: 4.5, stock: 150, numReviews: 350 },
    { name: 'Tennis Racket', price: 4999, brand: 'Wilson', rating: 4.6, stock: 60, numReviews: 200 },
    { name: 'Badminton Racket', price: 1999, brand: 'Yonex', rating: 4.5, stock: 100, numReviews: 300 },
    { name: 'Cricket Bat', price: 2999, brand: 'SG', rating: 4.4, stock: 80, numReviews: 250 },
    { name: 'Football', price: 999, brand: 'Nike', rating: 4.3, stock: 200, numReviews: 500 },
    { name: 'Basketball', price: 1299, brand: 'Spalding', rating: 4.4, stock: 150, numReviews: 350 },
    { name: 'Volleyball', price: 899, brand: 'Mikasa', rating: 4.3, stock: 180, numReviews: 400 },
    { name: 'Swimming Goggles', price: 599, brand: 'Speedo', rating: 4.4, stock: 200, numReviews: 450 },
    { name: 'Swimming Cap', price: 299, brand: 'Speedo', rating: 4.2, stock: 250, numReviews: 500 },
    { name: 'Cycling Helmet', price: 1999, brand: 'Decathlon', rating: 4.5, stock: 100, numReviews: 300 },
    { name: 'Fitness Tracker', price: 2999, brand: 'Fitbit', rating: 4.6, stock: 120, numReviews: 400 },
  ];

  // Books & Stationary - 30 products
  const booksProducts = [
    { name: 'The Great Gatsby', price: 299, brand: 'Penguin', rating: 4.7, stock: 200, numReviews: 800 },
    { name: 'To Kill a Mockingbird', price: 349, brand: 'Penguin', rating: 4.8, stock: 180, numReviews: 700 },
    { name: '1984', price: 299, brand: 'Penguin', rating: 4.6, stock: 220, numReviews: 900 },
    { name: 'Pride and Prejudice', price: 279, brand: 'Penguin', rating: 4.7, stock: 200, numReviews: 750 },
    { name: 'The Catcher in the Rye', price: 319, brand: 'Penguin', rating: 4.5, stock: 150, numReviews: 600 },
    { name: 'Lord of the Rings', price: 599, brand: 'HarperCollins', rating: 4.9, stock: 100, numReviews: 500 },
    { name: 'Harry Potter Set', price: 2999, brand: 'Bloomsbury', rating: 4.9, stock: 50, numReviews: 1000 },
    { name: 'The Alchemist', price: 199, brand: 'HarperOne', rating: 4.5, stock: 300, numReviews: 1200 },
    { name: 'Sapiens', price: 499, brand: 'Harper', rating: 4.7, stock: 120, numReviews: 400 },
    { name: 'Atomic Habits', price: 399, brand: 'Penguin', rating: 4.8, stock: 180, numReviews: 600 },
    { name: 'Notebook A4 200 Pages', price: 199, brand: 'Classmate', rating: 4.3, stock: 500, numReviews: 800 },
    { name: 'Pen Set 10 Pcs', price: 149, brand: 'Reynolds', rating: 4.2, stock: 600, numReviews: 1000 },
    { name: 'Pencil Set 12 Pcs', price: 99, brand: 'Apsara', rating: 4.1, stock: 800, numReviews: 1200 },
    { name: 'Eraser Pack 5', price: 49, brand: 'Apsara', rating: 4.0, stock: 1000, numReviews: 1500 },
    { name: 'Sharpener', price: 29, brand: 'Apsara', rating: 4.1, stock: 900, numReviews: 1100 },
    { name: 'Ruler 30cm', price: 39, brand: 'Classmate', rating: 4.0, stock: 700, numReviews: 800 },
    { name: 'Geometry Box', price: 199, brand: 'Classmate', rating: 4.2, stock: 400, numReviews: 600 },
    { name: 'Highlighter Set 5', price: 149, brand: 'Staedtler', rating: 4.3, stock: 500, numReviews: 700 },
    { name: 'Marker Set 12', price: 299, brand: 'Staedtler', rating: 4.4, stock: 300, numReviews: 500 },
    { name: 'Sticky Notes Pack', price: 99, brand: '3M', rating: 4.2, stock: 600, numReviews: 800 },
    { name: 'File Folder Set 10', price: 199, brand: 'Classmate', rating: 4.1, stock: 400, numReviews: 500 },
    { name: 'Clipboard', price: 149, brand: 'Classmate', rating: 4.0, stock: 500, numReviews: 600 },
    { name: 'Calculator Scientific', price: 499, brand: 'Casio', rating: 4.5, stock: 200, numReviews: 400 },
    { name: 'Calculator Basic', price: 199, brand: 'Casio', rating: 4.3, stock: 300, numReviews: 500 },
    { name: 'Stapler', price: 199, brand: 'Classmate', rating: 4.2, stock: 400, numReviews: 600 },
    { name: 'Staples Pack', price: 49, brand: 'Classmate', rating: 4.0, stock: 800, numReviews: 1000 },
    { name: 'Paper Clips Box', price: 39, brand: 'Classmate', rating: 4.1, stock: 700, numReviews: 900 },
    { name: 'Binder Clips Set', price: 99, brand: 'Classmate', rating: 4.2, stock: 500, numReviews: 600 },
    { name: 'Punching Machine', price: 299, brand: 'Classmate', rating: 4.1, stock: 300, numReviews: 400 },
    { name: 'Glue Stick', price: 49, brand: 'Fevicol', rating: 4.0, stock: 900, numReviews: 1200 },
  ];

  // Gaming - 30 products
  const gamingProducts = [
    { name: 'PlayStation 5', price: 49999, brand: 'Sony', rating: 4.9, stock: 20, numReviews: 500 },
    { name: 'Xbox Series X', price: 49999, brand: 'Microsoft', rating: 4.8, stock: 18, numReviews: 450 },
    { name: 'Nintendo Switch', price: 29999, brand: 'Nintendo', rating: 4.7, stock: 40, numReviews: 600 },
    { name: 'Gaming Laptop RTX 4060', price: 99999, brand: 'ASUS', rating: 4.8, stock: 15, numReviews: 200 },
    { name: 'Gaming Mouse RGB', price: 2999, brand: 'Logitech', rating: 4.6, stock: 150, numReviews: 500 },
    { name: 'Gaming Keyboard Mechanical', price: 5999, brand: 'Corsair', rating: 4.7, stock: 100, numReviews: 400 },
    { name: 'Gaming Headset', price: 4999, brand: 'SteelSeries', rating: 4.6, stock: 120, numReviews: 450 },
    { name: 'Gaming Chair', price: 19999, brand: 'Razer', rating: 4.5, stock: 30, numReviews: 200 },
    { name: 'Gaming Monitor 27" 144Hz', price: 24999, brand: 'ASUS', rating: 4.7, stock: 40, numReviews: 300 },
    { name: 'Gaming Controller', price: 4999, brand: 'Xbox', rating: 4.6, stock: 80, numReviews: 350 },
    { name: 'Gaming Mouse Pad', price: 999, brand: 'Razer', rating: 4.4, stock: 200, numReviews: 500 },
    { name: 'Webcam 1080p', price: 4999, brand: 'Logitech', rating: 4.5, stock: 100, numReviews: 300 },
    { name: 'Microphone USB', price: 3999, brand: 'Blue Yeti', rating: 4.6, stock: 60, numReviews: 250 },
    { name: 'Stream Deck', price: 14999, brand: 'Elgato', rating: 4.7, stock: 25, numReviews: 150 },
    { name: 'Capture Card', price: 9999, brand: 'Elgato', rating: 4.6, stock: 30, numReviews: 180 },
    { name: 'Gaming SSD 1TB', price: 6999, brand: 'Samsung', rating: 4.7, stock: 80, numReviews: 400 },
    { name: 'RAM 16GB DDR5', price: 5999, brand: 'Corsair', rating: 4.6, stock: 70, numReviews: 300 },
    { name: 'Graphics Card RTX 4070', price: 59999, brand: 'NVIDIA', rating: 4.8, stock: 10, numReviews: 100 },
    { name: 'Power Supply 750W', price: 6999, brand: 'Corsair', rating: 4.5, stock: 50, numReviews: 200 },
    { name: 'CPU Cooler AIO', price: 8999, brand: 'Corsair', rating: 4.6, stock: 40, numReviews: 180 },
    { name: 'Gaming Case RGB', price: 7999, brand: 'NZXT', rating: 4.5, stock: 60, numReviews: 250 },
    { name: 'Elden Ring PS5', price: 3999, brand: 'FromSoftware', rating: 4.9, stock: 50, numReviews: 300 },
    { name: 'God of War Ragnarok', price: 3999, brand: 'Sony', rating: 4.8, stock: 45, numReviews: 280 },
    { name: 'Spider-Man 2', price: 3999, brand: 'Sony', rating: 4.7, stock: 40, numReviews: 250 },
    { name: 'Zelda Tears of Kingdom', price: 4999, brand: 'Nintendo', rating: 4.9, stock: 35, numReviews: 200 },
    { name: 'Mario Kart 8 Deluxe', price: 3999, brand: 'Nintendo', rating: 4.8, stock: 60, numReviews: 400 },
    { name: 'FIFA 24', price: 3999, brand: 'EA Sports', rating: 4.5, stock: 80, numReviews: 500 },
    { name: 'Call of Duty Modern Warfare', price: 4999, brand: 'Activision', rating: 4.6, stock: 70, numReviews: 450 },
    { name: 'GTA V', price: 1999, brand: 'Rockstar', rating: 4.7, stock: 100, numReviews: 800 },
    { name: 'Minecraft', price: 1999, brand: 'Mojang', rating: 4.8, stock: 120, numReviews: 1000 },
  ];

  // Helper function to generate high-quality image URLs
  const getImageUrl = (productName, categoryName) => {
    // Use Unsplash Source API for high-quality images
    const imageMap = {
      'Electronics': {
        'iPhone': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'Samsung': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'MacBook': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
        'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'AirPods': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
        'iPad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        'TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
        'Camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
        'Drone': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
        'Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        'Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        'Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        'Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
        'default': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop',
      },
      'Fashion & Clothing': {
        'T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'Dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
        'Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec32c3a7ee?w=400&h=400&fit=crop',
        'Sneakers': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
        'Shirt': 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop',
        'Coat': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        'Sunglasses': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        'Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        'Handbag': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        'default': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      },
      'Home & Furniture': {
        'Sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
        'Table': 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop',
        'Bed': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
        'Mattress': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
        'Wardrobe': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        'Chair': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
        'default': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      },
      'Beauty & Personal Care': {
        'default': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
      },
      'Toys & Baby Products': {
        'default': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop',
      },
      'Sports & Fitness': {
        'default': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      },
      'Books & Stationary': {
        'default': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      },
      'Gaming': {
        'default': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
      },
    };

    const categoryImages = imageMap[categoryName] || {};
    const productNameLower = productName.toLowerCase();
    
    for (const [key, url] of Object.entries(categoryImages)) {
      if (key !== 'default' && productNameLower.includes(key.toLowerCase())) {
        return url;
      }
    }
    
    return categoryImages.default || `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`;
  };

  // Map products to categories
  const categoryProductMap = {
    'Electronics': electronicsProducts,
    'Fashion & Clothing': fashionProducts,
    'Home & Furniture': homeProducts,
    'Beauty & Personal Care': beautyProducts,
    'Toys & Baby Products': toysProducts,
    'Sports & Fitness': sportsProducts,
    'Books & Stationary': booksProducts,
    'Gaming': gamingProducts,
  };

  // Generate all products with descriptions and images
  categories.forEach((category) => {
    const categoryProducts = categoryProductMap[category.name] || [];
    categoryProducts.forEach((product, index) => {
      allProducts.push({
        name: product.name,
        description: `Premium quality ${product.name.toLowerCase()} from ${product.brand}. Perfect for your needs with excellent features and durability.`,
        price: product.price,
        categoryName: category.name,
        image: getImageUrl(product.name, category.name),
        stock: product.stock,
        brand: product.brand,
        rating: product.rating,
        numReviews: product.numReviews,
      });
    });
  });

  return allProducts;
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created:', createdCategories.length);

    // Create category map
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Generate all products
    const allProducts = generateProducts();

    // Insert products with category references
    const productsWithCategories = allProducts.map((product) => ({
      ...product,
      category: categoryMap[product.categoryName],
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Products created:', createdProducts.length);
    console.log('Products per category:');
    categories.forEach((cat) => {
      const count = allProducts.filter(p => p.categoryName === cat.name).length;
      console.log(`  ${cat.name}: ${count} products`);
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
