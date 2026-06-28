const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, maxlength: 150 },
  password: { type: String, required: true, minlength: 6, maxlength: 128 },
  role: { type: String, enum: ['customer', 'employee', 'admin'], default: 'customer' },
  phone: { type: String, maxlength: 20 },
  address: { type: String, maxlength: 250 },
  avatar: { type: String, maxlength: 1024 },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String },
  permissions: [{
    type: String,
    enum: ['manage_products', 'manage_orders', 'manage_customers', 'view_reports', 'manage_employees']
  }]
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
