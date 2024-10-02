import mongoose from 'mongoose';

const purchaseInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  partyName: { type: String},
  items: [
    {
      description: { type: String},
      quantity: { type: Number},
      weight: { type: String },
      rate: { type: Number},
      total: { type: Number},
    },
  ],
  details: {
    carNo: { type: String},
    carRent: { type: Number},
    gojarkhanWeight: { type: Number},
    receivedWeight: { type: Number},
    nag: { type: Number},
  },
  totalAmount: { type: Number, default: 0},
  previousBalance: { type: Number, default: 0},
  grandTotal: { type: Number, default: 0},
});

const PurchaseInvoice = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);
export default PurchaseInvoice;
