const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
['uploads/products', 'uploads/avatars'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const createStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, `uploads/${folder}/`),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${folder}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const productUpload = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

module.exports = { productUpload };
