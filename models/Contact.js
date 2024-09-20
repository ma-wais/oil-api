import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['customer', 'party'], required: true },
  openingDr: { type: Number, default: 0 },
  openingCr: { type: Number, default: 0 },
});

export default mongoose.model('Contact', ContactSchema);