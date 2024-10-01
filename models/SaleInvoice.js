import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  description: { type: String},
  quantity: { type: Number },
  weight: { type: String },
  rate: { type: Number},
  total: { type: Number },
});

const saleInvoiceSchema = new mongoose.Schema({
  billNo: { type: String},
  customerName: { type: String},
  date: { type: Date},
  items: [saleItemSchema],
  totalAmount: { type: Number},
  receivedCash: { type: Number},
  previousBalance: { type: Number, default: 0 },
  grandTotal: { type: Number},
});

const SaleInvoice = mongoose.model('SaleInvoice', saleInvoiceSchema);
export default SaleInvoice;
