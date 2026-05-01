const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Force Google/Cloudflare DNS to resolve MongoDB SRV records (fixes Windows DNS issues)
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Steelbird SBA-7 Hero Full Face Helmet',
    description: 'ISI certified full face helmet with high-impact ABS shell, scratch-resistant visor, and multi-density EPS liner for superior protection. Features quick-release chin strap and aerodynamic design.',
    price: 1899,
    category: 'Helmet',
    brand: 'Steelbird',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    discount: 15,
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Red', 'Blue'],
    images: ['/uploads/helmet.png'],
  },
  {
    name: 'Studds Thunder D5 Full Face Helmet',
    description: 'Aerodynamic full face helmet with advanced ventilation system, anti-scratch visor, and hypoallergenic liner. DOT and ISI certified for maximum safety.',
    price: 1499,
    category: 'Helmet',
    brand: 'Studds',
    stock: 35,
    rating: 4.3,
    numReviews: 95,
    discount: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Matt Black', 'White', 'Grey'],
    images: ['/uploads/helmet.png'],
  },
  {
    name: 'Axor Apex Carbon Fiber Helmet',
    description: 'Premium carbon fiber shell helmet weighing just 1200g. Features dual-visor system, Pinlock-ready, multiple air vents, and premium interior padding.',
    price: 7999,
    category: 'Helmet',
    brand: 'Axor',
    stock: 15,
    rating: 4.8,
    numReviews: 42,
    discount: 5,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Carbon Black', 'Carbon Red'],
    images: ['/uploads/helmet.png'],
  },
  {
    name: 'Rynox Storm Evo 2 Riding Gloves',
    description: 'All-season touring gloves with goatskin palm, Knox SPS flex knuckle armor, touch-screen compatible fingertips, and waterproof Hipora membrane.',
    price: 2499,
    category: 'Gloves',
    brand: 'Rynox',
    stock: 40,
    rating: 4.6,
    numReviews: 73,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Black-Red'],
    images: ['/uploads/gloves.png'],
  },
  {
    name: 'Royal Enfield Stalwart Gloves',
    description: 'Premium leather riding gloves with carbon fiber knuckle protection, reinforced palm slider, and adjustable wrist closure. Perfect for touring.',
    price: 1899,
    category: 'Gloves',
    brand: 'Royal Enfield',
    stock: 30,
    rating: 4.2,
    numReviews: 56,
    discount: 20,
    sizes: ['M', 'L', 'XL'],
    colors: ['Brown', 'Black'],
    images: ['/uploads/gloves.png'],
  },
  {
    name: 'Rynox Advento ABS Mesh Jacket',
    description: 'Adventure touring jacket with 600D polyester shell, CE Level 2 armor at shoulders, elbows, and back. Features 3M Scotchlite reflective panels and all-weather liner.',
    price: 5999,
    category: 'Jacket',
    brand: 'Rynox',
    stock: 25,
    rating: 4.7,
    numReviews: 89,
    discount: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey-Neon'],
    images: ['/uploads/jacket.png'],
  },
  {
    name: 'Solace Rival Urban Riding Jacket',
    description: 'Urban-style riding jacket with aramid-reinforced fabric, D3O armor inserts, ventilated mesh panels, and waterproof zip pocket. Casual enough for daily wear.',
    price: 4499,
    category: 'Jacket',
    brand: 'Solace',
    stock: 20,
    rating: 4.4,
    numReviews: 67,
    discount: 15,
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal', 'Olive', 'Black'],
    images: ['/uploads/jacket.png'],
  },
  {
    name: 'Royal Enfield Explorer V2 Jacket',
    description: 'Premium touring jacket built for long rides. Features Cordura 500D fabric, CE certified armor, thermal liner, rain liner, and multiple pockets. Built for Indian conditions.',
    price: 8999,
    category: 'Jacket',
    brand: 'Royal Enfield',
    stock: 12,
    rating: 4.6,
    numReviews: 34,
    discount: 0,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Olive Green', 'Black'],
    images: ['/uploads/jacket.png'],
  },
  {
    name: 'Solace Xtreme Riding Boots',
    description: 'High-ankle riding boots with oil-resistant sole, ankle protection cups, shin plate, and gear shift pad. Waterproof construction with breathable lining.',
    price: 4999,
    category: 'Boots',
    brand: 'Solace',
    stock: 18,
    rating: 4.5,
    numReviews: 45,
    discount: 10,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black'],
    images: ['/uploads/boots.png'],
  },
  {
    name: 'Rynox Dune Neo Knee Guards',
    description: 'CE Level 2 certified knee guards with hard shell and D3O Smart material. Adjustable straps for secure fit, ventilated design, and low-profile construction.',
    price: 2999,
    category: 'Guards',
    brand: 'Rynox',
    stock: 22,
    rating: 4.4,
    numReviews: 38,
    discount: 5,
    sizes: ['Free Size'],
    colors: ['Black'],
    images: ['/uploads/helmet.png'],
  },
  {
    name: 'Infinity Rides Premium Balaclava',
    description: 'Moisture-wicking balaclava with UV protection, anti-bacterial treatment, and seamless construction. Perfect for under-helmet comfort during long rides.',
    price: 499,
    category: 'Accessories',
    brand: 'Infinity Rides',
    stock: 100,
    rating: 4.1,
    numReviews: 120,
    discount: 0,
    sizes: ['Free Size'],
    colors: ['Black', 'Grey'],
    images: ['/uploads/helmet.png'],
  },
  {
    name: 'Claw Anchor Lock Disc Lock',
    description: 'Heavy-duty disc brake lock with 110dB alarm, hardened steel body, and reminder cable. Compact and portable anti-theft solution for your motorcycle.',
    price: 1299,
    category: 'Accessories',
    brand: 'Claw',
    stock: 45,
    rating: 4.3,
    numReviews: 87,
    discount: 10,
    sizes: [],
    colors: ['Yellow', 'Orange'],
    images: ['/uploads/helmet.png'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@infinityrides.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'admin',
      });
      console.log('👤 Admin user created');
    } else {
      console.log('👤 Admin already exists');
    }

    // Seed products
    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});

    console.log('📦 Seeding products...');
    for (const data of sampleProducts) {
      const product = new Product(data);
      await product.save();
    }
    console.log(`✅ ${sampleProducts.length} products seeded`);

    console.log('\n🏁 Seed complete!');
    console.log('Admin login: ' + process.env.ADMIN_EMAIL + ' / ' + process.env.ADMIN_PASSWORD);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
