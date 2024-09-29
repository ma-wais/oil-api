import Crushing from '../models/Crushing.js';
import Product from '../models/Product.js';

export const createCrushing = async (req, res) => {
  const { date, seedName, crushingAmount, partyName } = req.body;

  try {
    const product = await Product.findOne({ name: seedName });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stockInKg < crushingAmount) {
      return res.status(400).json({ message: 'Insufficient stock for crushing' });
    }

    product.stockInKg -= crushingAmount;
    await product.save();

    const crushing = new Crushing({
      date,
      seedName,
      crushingAmount,
      totalLeft: product.stockInKg,
      partyName
    });

    await crushing.save();
    res.status(201).json(crushing);
  } catch (error) {
    res.status(500).json({ message: 'Error recording crushing', error });
  }
};

export const getCrushingRecords = async (req, res) => {
  const { dateFrom, dateTo, partyName } = req.query;
  
  const query = {};

  if (dateFrom && dateTo) {
    query.date = {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    };
  }

  if (partyName) {
    query.partyName = { $regex: partyName, $options: 'i' };
  }

  try {
    const records = await Crushing.find(query);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crushing records', error });
  }
};
