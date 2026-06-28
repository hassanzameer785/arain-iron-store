const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const { Category } = require('./models/index');

const CATEGORIES = [
  { name: 'Iron Materials',       slug: 'iron-materials',       icon: '🔩', order: 1 },
  { name: 'Bricks',               slug: 'bricks',               icon: '🧱', order: 2 },
  { name: 'Concrete',             slug: 'concrete',             icon: '🪨', order: 3 },
  { name: 'Cement',               slug: 'cement',               icon: '🏗️', order: 4 },
  { name: 'Paint',                slug: 'paint',                icon: '🎨', order: 5 },
  { name: 'Bathroom Items',       slug: 'bathroom-items',       icon: '🚽', order: 6 },
  { name: 'Pipes',                slug: 'pipes',                icon: '🪛', order: 7 },
  { name: 'Bamboo',               slug: 'bamboo',               icon: '🎋', order: 8 },
  { name: 'Doors',                slug: 'doors',                icon: '🚪', order: 9 },
  { name: 'Windows',              slug: 'windows',              icon: '🪟', order: 10 },
  { name: 'Construction Services',slug: 'services',             icon: '🔨', order: 11 },
  { name: 'Tools',                slug: 'tools',                icon: '🔧', order: 12 },
  { name: 'Plastic & Sheets',     slug: 'plastic',              icon: '📦', order: 13 },
  { name: 'Other Hardware',       slug: 'other-hardware',       icon: '⚙️', order: 14 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create categories
  const cats = await Category.insertMany(CATEGORIES);
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c._id]));
  console.log(`📂 Created ${cats.length} categories`);

  // Create admin user
  await User.create({
    name: 'Admin',
    email: 'admin@arainiron.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
  });
  console.log('👤 Admin created — email: admin@arainiron.com  password: Admin@123');

  // Sample products
  const products = [
    // Iron Materials
    { name: 'TR (Tor Steel) 12mm', category: catMap['iron-materials'], subcategory: 'TR', price: 2200, unit: 'kg', qualityLevel: 'Standard', stock: 500, brand: 'Pakistan Steel', isFeatured: true },
    { name: 'TR (Tor Steel) 16mm', category: catMap['iron-materials'], subcategory: 'TR', price: 2250, unit: 'kg', qualityLevel: 'Standard', stock: 300 },
    { name: 'Girder 4 inch',       category: catMap['iron-materials'], subcategory: 'Girder', price: 5500, unit: 'piece', qualityLevel: 'Standard', stock: 80, isFeatured: true },
    { name: 'Saria 10mm',          category: catMap['iron-materials'], subcategory: 'Saria', price: 1800, unit: 'kg', qualityLevel: 'Economy', stock: 600 },
    { name: 'Angle Iron 2 inch',   category: catMap['iron-materials'], subcategory: 'Angle', price: 1200, unit: 'piece', qualityLevel: 'Standard', stock: 150 },

    // Bricks
    { name: '3 Inch Bricks (12x6)', category: catMap['bricks'], price: 18, unit: 'piece', qualityLevel: 'Standard', stock: 10000, isFeatured: true },
    { name: 'Tissue Brick 1.5 inch (9x4)', category: catMap['bricks'], price: 10, unit: 'piece', qualityLevel: 'Economy', stock: 15000 },
    { name: 'Class A Bricks',      category: catMap['bricks'], price: 22, unit: 'piece', qualityLevel: 'Premium', stock: 8000 },

    // Cement
    { name: 'DG Cement 50kg Bag',  category: catMap['cement'], price: 1250, unit: 'bag', qualityLevel: 'Premium', stock: 500, isFeatured: true },
    { name: 'Pak Cement 50kg Bag', category: catMap['cement'], price: 1200, unit: 'bag', qualityLevel: 'Standard', stock: 400 },
    { name: 'White Cement 25kg',   category: catMap['cement'], price: 850, unit: 'bag', qualityLevel: 'Standard', stock: 200 },

    // Concrete
    { name: 'Zero Number Concrete (Bajri)', category: catMap['concrete'], price: 4500, unit: 'ton', qualityLevel: 'Standard', stock: 50 },
    { name: 'Bari Concrete',               category: catMap['concrete'], price: 3800, unit: 'ton', qualityLevel: 'Standard', stock: 60 },
    { name: 'Crush (Grade A)',             category: catMap['concrete'], price: 5200, unit: 'ton', qualityLevel: 'Premium', stock: 40, isFeatured: true },

    // Paint
    { name: 'Distemper Paint 20kg',     category: catMap['paint'], price: 2200, unit: 'piece', qualityLevel: 'Standard', stock: 60 },
    { name: 'Weather Shield Paint 4L',  category: catMap['paint'], price: 3500, unit: 'piece', qualityLevel: 'Premium', stock: 40 },
    { name: 'Master Emulsion Paint 20L',category: catMap['paint'], price: 4800, unit: 'piece', qualityLevel: 'Premium', stock: 30, isFeatured: true },

    // Bathroom
    { name: 'Western Toilet (Standard)',   category: catMap['bathroom-items'], price: 8500, unit: 'piece', qualityLevel: 'Standard', stock: 20 },
    { name: 'Western Toilet (Designer)',   category: catMap['bathroom-items'], price: 18000, unit: 'piece', qualityLevel: 'Premium', stock: 10 },
    { name: 'Indian Toilet',               category: catMap['bathroom-items'], price: 4500, unit: 'piece', qualityLevel: 'Standard', stock: 25 },

    // Pipes
    { name: 'PVC Pipe 1 inch (10ft)',    category: catMap['pipes'], price: 350, unit: 'piece', qualityLevel: 'Standard', stock: 200 },
    { name: 'PVC Pipe 2 inch (10ft)',    category: catMap['pipes'], price: 650, unit: 'piece', qualityLevel: 'Standard', stock: 150 },
    { name: 'Tube Well Steel Pipe 4inch',category: catMap['pipes'], price: 3200, unit: 'piece', qualityLevel: 'Premium', stock: 30, isFeatured: true },
    { name: 'Plastic Agriculture Pipe',  category: catMap['pipes'], price: 280, unit: 'meter', qualityLevel: 'Economy', stock: 500 },

    // Bamboo
    { name: 'Bamboo Pole (20ft)',  category: catMap['bamboo'], price: 850, unit: 'piece', qualityLevel: 'Standard', stock: 100 },
    { name: 'Bamboo Stairs',       category: catMap['bamboo'], price: 4500, unit: 'piece', qualityLevel: 'Standard', stock: 20 },

    // Doors
    { name: 'Iron Main Gate (6x4ft)',    category: catMap['doors'], price: 22000, unit: 'piece', qualityLevel: 'Premium', stock: 8, isFeatured: true },
    { name: 'Room Door with Frame',      category: catMap['doors'], price: 8500, unit: 'piece', qualityLevel: 'Standard', stock: 15 },
    { name: 'Steel Frame Single Door',   category: catMap['doors'], price: 12000, unit: 'piece', qualityLevel: 'Premium', stock: 10 },
    { name: 'Double Side Main Door',     category: catMap['doors'], price: 35000, unit: 'piece', qualityLevel: 'Premium', stock: 5 },
    { name: 'Bathroom Door Frame',       category: catMap['doors'], price: 3500, unit: 'piece', qualityLevel: 'Standard', stock: 30 },

    // Windows
    { name: 'Iron Window 3x4ft',            category: catMap['windows'], price: 6500, unit: 'piece', qualityLevel: 'Standard', stock: 20 },
    { name: 'Glass Protection Grill 3x4ft', category: catMap['windows'], price: 4800, unit: 'piece', qualityLevel: 'Standard', stock: 25 },

    // Tools
    { name: 'Single Tyre Hand Trolley', category: catMap['tools'], price: 3200, unit: 'piece', qualityLevel: 'Standard', stock: 15, isFeatured: true },

    // Plastic
    { name: 'Polythene Sheet (100ft roll)', category: catMap['plastic'], price: 2800, unit: 'piece', qualityLevel: 'Standard', stock: 50 },

    // Other Hardware
    { name: 'Nut Bolt Set (1 dozen)',       category: catMap['other-hardware'], price: 120, unit: 'dozen', qualityLevel: 'Standard', stock: 200 },
    { name: 'Wire Brush (Set of 3)',        category: catMap['other-hardware'], price: 350, unit: 'piece', qualityLevel: 'Standard', stock: 80 },
    { name: 'Nails (1kg Assorted)',         category: catMap['other-hardware'], price: 180, unit: 'kg', qualityLevel: 'Economy', stock: 150 },
    { name: 'Plaster Foam Sheet',           category: catMap['other-hardware'], price: 650, unit: 'piece', qualityLevel: 'Standard', stock: 60 },
    { name: 'Kana/Pattal (Bundle)',         category: catMap['other-hardware'], price: 1200, unit: 'bundle', qualityLevel: 'Standard', stock: 40 },
    { name: 'Tube Well Pipe Accessories Kit', category: catMap['other-hardware'], price: 950, unit: 'piece', qualityLevel: 'Standard', stock: 35 },
  ];

  await Product.insertMany(products.map(p => ({ ...p, description: `High quality ${p.name} available at Arain Iron Store Vehova. Trusted since 1998.` })));
  console.log(`📦 Created ${products.length} products`);

  console.log('\n✅ Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin Login:');
  console.log('  Email:    admin@arainiron.com');
  console.log('  Password: Admin@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
