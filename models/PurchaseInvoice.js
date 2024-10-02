import mongoose from 'mongoose';

const purchaseInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  partyName: { type: String},
  items: [
    {
      description: { type: String},
      quantity: { type: Number, min: 0 },
      weight: { type: String },
      rate: { type: Number, min: 0 },
      total: { type: Number, min: 0 },
    },
  ],
  details: {
    carNo: { type: String},
    carRent: { type: Number, min: 0 },
    gojarkhanWeight: { type: Number, min: 0 },
    receivedWeight: { type: Number, min: 0 },
    nag: { type: Number, min: 0 },
  },
  totalAmount: { type: Number, default: 0, min: 0 },
  previousBalance: { type: Number, default: 0, min: 0 },
  grandTotal: { type: Number, default: 0, min: 0 },
});

const PurchaseInvoice = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);
export default PurchaseInvoice;
