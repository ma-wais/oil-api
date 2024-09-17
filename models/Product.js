import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stockInKg: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
