// Seed script to populate initial categories and products
// Run with: node src/layouts/db-operations/seed.js

import dotenv from 'dotenv';
import connectDB from './db-connection.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

// Client-specific categories
const categories = [
  { name: 'Anti Tarnish Jewellery', slug: 'anti-tarnish-jewellery', description: 'Premium anti-tarnish fashion jewellery for daily wear and occasions.' },
  { name: 'Kids Toys', slug: 'kids-toys', description: 'Fun and safe toys for children of all ages.' },
  { name: 'Customized Bottles & Key Chains', slug: 'customized-bottles-key-chains', description: 'Personalised bottles and key chains for gifting and branding.' },
  { name: 'Chinese Products', slug: 'chinese-products', description: 'Trendy, value-for-money Chinese import products.' },
  { name: 'Itar / Spray', slug: 'itar-spray', description: 'Long-lasting itar and body spray fragrances.' },
  { name: 'Decorative Items', slug: 'decorative-items', description: 'Home and office decor items to elevate your space.' },
  { name: 'Watches', slug: 'watches', description: 'Stylish watches for men, women, and kids.' },
  { name: 'Stationery Items', slug: 'stationery-items', description: 'Daily-use stationery for school, college and office.' },
  { name: 'Bagz', slug: 'bagz', description: 'Bags for school, travel, work and casual use.' },
];

const CATEGORY_IMAGE_BASE = {
  'Anti Tarnish Jewellery': 'https://images.unsplash.com/photo-1522312298940-653d99d52d2b',
  'Kids Toys': 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e',
  'Customized Bottles & Key Chains': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
  'Chinese Products': 'https://images.unsplash.com/photo-1505739775417-85e302c1d326',
  'Itar / Spray': 'https://images.unsplash.com/photo-1505322023814-26b7c0c7cfcf',
  'Decorative Items': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  'Stationery Items': 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
  'Bagz': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
};

const getCategoryImage = (categoryName, index = 0) => {
  const base = CATEGORY_IMAGE_BASE[categoryName] || 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece';
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}w=600&h=600&fit=crop&auto=format&q=80&ixlib=rb-4.0.3&rand=${index}`;
};

// Client-specific sample products by category
const productsByCategory = {
  'Anti Tarnish Jewellery': [
    {
      name: 'Anti-Tarnish Gold Plated Necklace Set',
      description: 'Elegant gold-plated necklace with matching earrings, coated with anti-tarnish layer for daily wear.',
      price: 899,
      stock: 60,
      brand: 'ATJ Collection',
    },
    {
      name: 'Anti-Tarnish Oxidised Silver Bangles (Set of 4)',
      description: 'Traditional oxidised silver bangles with anti-tarnish finish, perfect for festive occasions.',
      price: 549,
      stock: 80,
      brand: 'ATJ Collection',
    },
    {
      name: 'Anti-Tarnish Adjustable Finger Ring',
      description: 'Minimal adjustable ring with cubic stones, anti-tarnish coated for long-lasting shine.',
      price: 299,
      stock: 120,
      brand: 'ATJ Collection',
    },
    {
      name: 'Anti-Tarnish Layered Chain',
      description: 'Trendy layered chain necklace, lightweight and safe for sensitive skin.',
      price: 449,
      stock: 90,
      brand: 'ATJ Collection',
    },
    {
      name: 'Anti-Tarnish Jhumka Earrings',
      description: 'Classic jhumka earrings with intricate detailing and anti-tarnish protection.',
      price: 399,
      stock: 100,
      brand: 'ATJ Collection',
    },
    {
      name: 'Anti-Tarnish Bridal Choker Set',
      description: 'Heavy bridal choker set with stones and pearls, ideal for weddings and receptions.',
      price: 1499,
      stock: 25,
      brand: 'ATJ Bridal',
    },
  ],
  'Kids Toys': [
    {
      name: 'Musical Dancing Duck Toy',
      description: 'Battery-operated dancing duck with music and lights, safe for kids 3+ years.',
      price: 499,
      stock: 80,
      brand: 'FunKids',
    },
    {
      name: 'Building Blocks Set (120 Pieces)',
      description: 'Colourful interlocking blocks that help kids improve creativity and motor skills.',
      price: 599,
      stock: 100,
      brand: 'FunKids',
    },
    {
      name: 'Pull Back Racing Cars (Pack of 6)',
      description: 'Mini metal pull-back cars in assorted colours, ideal as return gifts.',
      price: 349,
      stock: 150,
      brand: 'Speedy Kids',
    },
    {
      name: 'Soft Plush Teddy Bear 30cm',
      description: 'Super soft plush teddy bear, washable and safe for toddlers.',
      price: 399,
      stock: 90,
      brand: 'Cuddle Soft',
    },
    {
      name: 'Alphabet & Number Learning Board',
      description: 'Wooden learning board with alphabets and numbers for early education.',
      price: 299,
      stock: 120,
      brand: 'EduPlay',
    },
    {
      name: 'Doctor Play Set for Kids',
      description: 'Plastic doctor kit with stethoscope, thermometer and accessories.',
      price: 449,
      stock: 70,
      brand: 'RolePlay',
    },
  ],
  'Customized Bottles & Key Chains': [
    {
      name: 'Personalised Stainless Steel Water Bottle 750ml',
      description: 'Vacuum-insulated bottle with custom name print, keeps drinks hot or cold for hours.',
      price: 799,
      stock: 60,
      brand: 'CustomCraft',
    },
    {
      name: 'Name Engraved Metal Key Chain',
      description: 'Premium metal key chain with laser-engraved name, ideal for gifting.',
      price: 249,
      stock: 200,
      brand: 'CustomCraft',
    },
    {
      name: 'Photo Printed Sipper Bottle',
      description: 'Aluminium sipper bottle with custom photo print and leak-proof cap.',
      price: 699,
      stock: 50,
      brand: 'GiftStudio',
    },
    {
      name: 'LED Name Key Chain',
      description: 'Acrylic LED key chain that glows your name when switched on.',
      price: 299,
      stock: 120,
      brand: 'GlowTag',
    },
    {
      name: 'Corporate Logo Steel Bottle',
      description: 'Matte finish steel bottle with custom logo print for corporate gifting.',
      price: 899,
      stock: 40,
      brand: 'Corporate Gifts',
    },
  ],
  'Chinese Products': [
    {
      name: 'LED Fairy String Lights 10m',
      description: 'Warm white LED string lights for room and decor, USB powered.',
      price: 349,
      stock: 150,
      brand: 'DecorLite',
    },
    {
      name: 'Portable Mini USB Fan',
      description: 'Compact USB-powered fan, perfect for office desks and travel.',
      price: 299,
      stock: 120,
      brand: 'CoolMini',
    },
    {
      name: 'Motion Sensor Night Lamp',
      description: 'Plug-in motion sensor light for corridors and washrooms.',
      price: 399,
      stock: 90,
      brand: 'BrightWay',
    },
    {
      name: 'Foldable Mobile Stand',
      description: 'Adjustable foldable stand for mobile phones and small tablets.',
      price: 199,
      stock: 200,
      brand: 'GadgetEase',
    },
    {
      name: 'Rechargeable Touch Lamp',
      description: 'Multicolour touch-controlled bedside lamp with rechargeable battery.',
      price: 599,
      stock: 70,
      brand: 'GlowHome',
    },
  ],
  'Itar / Spray': [
    {
      name: 'Oudh Luxury Itar 12ml',
      description: 'Concentrated oudh-based itar with long-lasting woody fragrance.',
      price: 499,
      stock: 80,
      brand: 'Noor Fragrances',
    },
    {
      name: 'Rose Musk Itar 10ml',
      description: 'Delicate blend of rose and musk in a non-alcoholic itar base.',
      price: 399,
      stock: 100,
      brand: 'Noor Fragrances',
    },
    {
      name: 'Aqua Fresh Body Spray 200ml',
      description: 'Refreshing aqua fragrance body spray suitable for daily use.',
      price: 299,
      stock: 120,
      brand: 'Urban Mist',
    },
    {
      name: 'Oud Night Deodorant Spray',
      description: 'Strong oudh-based deodorant with 24-hour freshness.',
      price: 349,
      stock: 90,
      brand: 'Urban Mist',
    },
    {
      name: 'Combo Pack: 3 Mini Itars',
      description: 'Gift box with three mini itars in floral, woody and musky notes.',
      price: 599,
      stock: 50,
      brand: 'Noor Fragrances',
    },
  ],
  'Decorative Items': [
    {
      name: 'Metal Wall Hanging Tree of Life',
      description: 'Powder-coated metal wall art in tree of life design for living rooms.',
      price: 1299,
      stock: 40,
      brand: 'DecorCraft',
    },
    {
      name: 'LED Glass Jar Lantern',
      description: 'Decorative glass jar lantern with warm LED string lights inside.',
      price: 499,
      stock: 70,
      brand: 'GlowDecor',
    },
    {
      name: 'Artificial Flower Bunch (Set of 3)',
      description: 'Realistic artificial flower bunches for vase decoration.',
      price: 399,
      stock: 90,
      brand: 'BloomArt',
    },
    {
      name: 'Framed Islamic Calligraphy Art',
      description: 'Premium frame with printed calligraphy art for wall decor.',
      price: 899,
      stock: 35,
      brand: 'ArtHouse',
    },
    {
      name: 'Scented Candle Set (4 Pieces)',
      description: 'Set of four scented candles in glass jars for ambience.',
      price: 549,
      stock: 80,
      brand: 'Aroma Home',
    },
  ],
  'Watches': [
    {
      name: 'Analog Casual Watch for Men',
      description: 'Round dial analog watch with leather strap, suitable for daily wear.',
      price: 999,
      stock: 60,
      brand: 'TimeZone',
    },
    {
      name: 'Elegant Bracelet Watch for Women',
      description: 'Rose gold bracelet watch with crystal-studded dial.',
      price: 1199,
      stock: 50,
      brand: 'TimeZone',
    },
    {
      name: 'Digital Sports Watch',
      description: 'Shock-resistant digital watch with stopwatch and backlight.',
      price: 799,
      stock: 80,
      brand: 'SportX',
    },
    {
      name: 'Kids Cartoon Character Watch',
      description: 'Colourful kids watch with cartoon character strap.',
      price: 399,
      stock: 100,
      brand: 'KidsTime',
    },
    {
      name: 'Minimalist Slim Dial Watch',
      description: 'Ultra-slim dial unisex watch with mesh strap.',
      price: 899,
      stock: 70,
      brand: 'UrbanTime',
    },
  ],
  'Stationery Items': [
    {
      name: 'A4 Spiral Notebook (200 Pages)',
      description: 'Thick paper spiral notebook ideal for school and office notes.',
      price: 149,
      stock: 200,
      brand: 'WriteOn',
    },
    {
      name: 'Premium Gel Pen Set (Pack of 10)',
      description: 'Smooth writing gel pens with quick-dry ink.',
      price: 199,
      stock: 250,
      brand: 'WriteOn',
    },
    {
      name: 'Highlighter Set (Pack of 5)',
      description: 'Neon colour highlighters with chisel tip.',
      price: 179,
      stock: 180,
      brand: 'NoteMark',
    },
    {
      name: 'Desk Organizer with Pen Stand',
      description: 'Multi-compartment desk organizer for pens, clips and notes.',
      price: 299,
      stock: 120,
      brand: 'DeskPro',
    },
    {
      name: 'Sticky Notes Cube (400 Sheets)',
      description: 'Multi-colour sticky notes for quick reminders.',
      price: 129,
      stock: 220,
      brand: 'NoteMark',
    },
  ],
  Bagz: [
    {
      name: 'College Backpack with Laptop Sleeve',
      description: 'Spacious backpack with padded laptop compartment and bottle holder.',
      price: 899,
      stock: 80,
      brand: 'Bagz',
    },
    {
      name: 'Kids School Bag with Cartoon Print',
      description: 'Lightweight school bag with attractive cartoon design.',
      price: 699,
      stock: 90,
      brand: 'Bagz Kids',
    },
    {
      name: 'Travel Duffle Bag',
      description: 'Medium-size duffle bag with shoulder strap for weekend trips.',
      price: 1099,
      stock: 60,
      brand: 'TravelMate',
    },
    {
      name: 'Office Laptop Bag',
      description: 'Sleek laptop bag with multiple compartments and padded handle.',
      price: 1199,
      stock: 50,
      brand: 'ProOffice',
    },
    {
      name: 'Sling Bag for Women',
      description: 'Compact crossbody sling bag for daily use.',
      price: 549,
      stock: 70,
      brand: 'UrbanBagz',
    },
  ],
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

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Build product list
    const allProducts = [];
    categories.forEach((category) => {
      const list = productsByCategory[category.name] || [];
      list.forEach((p, index) => {
        allProducts.push({
          name: p.name,
          description: p.description,
          price: p.price,
          categoryName: category.name,
          category: categoryMap[category.name],
          image: getCategoryImage(category.name, index),
          stock: p.stock,
          brand: p.brand,
          rating: 0,
          numReviews: 0,
        });
      });
    });

    const createdProducts = await Product.insertMany(allProducts);
    console.log('Products created:', createdProducts.length);
    console.log('Products per category:');
    categories.forEach((cat) => {
      const count = allProducts.filter((p) => p.categoryName === cat.name).length;
      console.log(`  ${cat.name}: ${count} products`);
    });

    console.log('Database seeded successfully with client-specific categories and products!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
