const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const Product = require('./models/product.model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, or test-api)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly fallback
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initial seed products
const initialProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality and crystal-clear hands-free calling.',
    price: 29990,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 15,
    rating: 4.8,
    numReviews: 124
  },
  {
    name: 'Apple MacBook Air M3 (16GB, 512GB)',
    description: 'Strikingly thin and fast with the next-generation M3 chip, delivering extraordinary speed, liquid retina display, and up to 18 hours battery life.',
    price: 114900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    stock: 8,
    rating: 4.9,
    numReviews: 89
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Powerful health insights, precision GPS, bright Always-On Retina display, and double tap gesture for effortless one-handed control.',
    price: 41900,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    stock: 20,
    rating: 4.7,
    numReviews: 54
  },
  {
    name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
    description: 'Custom full aluminum body mechanical keyboard with double-gasket design, hot-swappable switches, and QMK/VIA programmable support.',
    price: 14500,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    stock: 12,
    rating: 4.9,
    numReviews: 42
  },
  {
    name: 'Sony PlayStation 5 Slim Console',
    description: 'Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    price: 49990,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    stock: 5,
    rating: 4.9,
    numReviews: 210
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Ergonomic performance mouse with quiet clicks, 8K DPI any-surface tracking, and hyper-fast MagSpeed scrolling wheel.',
    price: 8995,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    stock: 25,
    rating: 4.8,
    numReviews: 76
  },
  {
    name: 'Bose SoundLink Revolve+ II Bluetooth Speaker',
    description: 'True 360-degree deep, jaw-dropping portable sound with flexible fabric handle and water/dust resistant IP55 rating.',
    price: 24500,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    stock: 10,
    rating: 4.6,
    numReviews: 38
  },
  {
    name: 'Minimalist Matte Ceramic Coffee Mug & Warmer',
    description: 'Smart self-heating ceramic mug set with inductive heating coaster to keep your beverage at the perfect temperature all day.',
    price: 3499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    stock: 30,
    rating: 4.5,
    numReviews: 29
  }
];

const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding initial sample products...');
      await Product.insertMany(initialProducts);
      console.log(`Successfully seeded ${initialProducts.length} sample products!`);
    } else {
      console.log(`Database already contains ${count} products.`);
    }
  } catch (err) {
    console.error('Error during product seeding:', err.message);
  }
};

// Database Connection with Automatic In-Memory Fallback
const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopkart';
  console.log(`Attempting to connect to MongoDB at ${uri}...`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('Connected to MongoDB successfully!');
    await seedProductsIfEmpty();
  } catch (primaryErr) {
    console.warn(`Local/Remote MongoDB connection failed (${primaryErr.message}).`);
    console.log('Spinning up automatic In-Memory MongoDB Server for immediate zero-config development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      console.log(`In-Memory MongoDB started at: ${memoryUri}`);

      await mongoose.connect(memoryUri);
      console.log('Connected to In-Memory MongoDB successfully!');
      await seedProductsIfEmpty();
    } catch (memErr) {
      console.error('CRITICAL: Failed to launch both primary and in-memory MongoDB:', memErr.message);
    }
  }
};

// Mount Routes
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'ShopKart API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🛒 ShopKart Server running on http://localhost:${PORT}`);
      console.log(`📦 REST Endpoints mounted on /customers, /products, /wishlist, /cart, /orders`);
      console.log(`===============================================`);
    });
  });
}

module.exports = { app, connectDatabase };
