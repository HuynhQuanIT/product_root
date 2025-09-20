const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.index = async (req, res) => {
  const { q } = req.query; // search term
  let products;
  if (q) {
    // search by product name OR supplier.name (case-insensitive)
    const suppliers = await Supplier.find({ name: { $regex: q, $options: 'i' } });
    const supplierIds = suppliers.map(s => s._id);
    products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { supplierId: { $in: supplierIds } }
      ]
    }).populate('supplierId');
  } else {
    products = await Product.find().populate('supplierId');
  }
  res.render('products/index', { products, q });
};

exports.newForm = async (req, res) => {
  const suppliers = await Supplier.find();
  res.render('products/form', { product: {}, suppliers });
};

exports.create = async (req, res) => {
  await Product.create(req.body);
  res.redirect('/products');
};

exports.editForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const suppliers = await Supplier.find();
  res.render('products/form', { product, suppliers });
};

exports.update = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/products');
};

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');
};