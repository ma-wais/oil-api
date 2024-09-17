import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  description: { type: String},
  quantity: { type: Number, required: true },
  weight: { type: String, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true },
});

const saleInvoiceSchema = new mongoose.Schema({
  billNo: { type: String, required: true },
  customerName: { type: String, required: true },
  date: { type: Date},
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true },
  receivedCash: { type: Number},
  previousBalance: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
});

const SaleInvoice = mongoose.model('SaleInvoice', saleInvoiceSchema);
export default SaleInvoice;
