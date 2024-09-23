import mongoose from 'mongoose';

const LedgerSchema = new mongoose.Schema({
  contactName: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  billNo: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Ledger = mongoose.model('Ledger', LedgerSchema);

export default Ledger;
