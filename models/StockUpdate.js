import mongoose from 'mongoose';

const stockUpdateSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  stockInKg: { type: Number, required: true },
  partyName: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const StockUpdate = mongoose.model('StockUpdate', stockUpdateSchema);

export default StockUpdate;
