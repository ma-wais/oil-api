import mongoose from 'mongoose';

const crushingSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, 
  seedName: { type: String, required: true },
  crushingAmount: { type: Number, required: true },
  totalLeft: { type: Number, required: true },
});

const Crushing = mongoose.model('Crushing', crushingSchema);
export default Crushing;
