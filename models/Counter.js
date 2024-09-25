import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequenceValue: { type: Number, required: true }
});

const Counter = mongoose.model('Counter', counterSchema);
export default Counter;
