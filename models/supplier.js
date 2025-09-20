const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Supplier', supplierSchema);