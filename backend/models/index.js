const mongoose = require('mongoose');

// Category Model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  icon: { type: String, maxlength: 1024 },
  image: { type: String, maxlength: 1024 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// Order Model
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, maxlength: 150 },
  price: { type: Number, max: 100000000 },
  quantity: { type: Number, required: true, min: 1, max: 10000 },
  unit: { type: String, maxlength: 20 }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true, max: 100000000 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentMethod: { type: String, default: 'online', maxlength: 50 },
  shippingAddress: {
    street: { type: String, maxlength: 250 },
    city: { type: String, maxlength: 100 },
    state: { type: String, maxlength: 100 },
    phone: { type: String, maxlength: 20 }
  },
  notes: { type: String, maxlength: 1000 }
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'AIS-' + Date.now().toString().slice(-8);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

// Review Model
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  isGeneral: { type: Boolean, default: false }, // homepage review
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Category, Order, Review };
