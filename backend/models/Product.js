const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, maxlength: 2000 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, maxlength: 100 },
  price: { type: Number, required: true, min: 0, max: 100000000 },
  unit: { type: String, default: 'piece', enum: ['piece', 'kg', 'ton', 'bag', 'feet', 'meter', 'dozen', 'bundle'] },
  qualityLevel: { type: String, enum: ['Standard', 'Premium', 'Economy'], default: 'Standard' },
  stock: { type: Number, default: 0, min: 0, max: 1000000 },
  lowStockAlert: { type: Number, default: 10, max: 10000 },
  images: [{ type: String }],
  sku: { type: String, unique: true, sparse: true, maxlength: 50 },
  brand: { type: String, maxlength: 100 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
