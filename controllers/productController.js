import Product from '../models/Product.js';
import StockUpdate from '../models/StockUpdate.js';

export const createProduct = async (req, res) => {
  const { name, stockInKg } = req.body;

  try {
    const product = new Product({ name, stockInKg });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) {
      query = { name: { $regex: name, $options: 'i' } };
    }
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const updateStock = async (req, res) => {
  const { name } = req.params;
  const { stockInKg, partyName, date } = req.body;

  try {
    const product = await Product.findOne({ name });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.stockInKg += Number(stockInKg);
    await product.save();

    const stockUpdate = new StockUpdate({
      productName: product.name,
      stockInKg: Number(stockInKg),
      partyName: partyName,
      date,
      totalLeft: product.stockInKg
    });
    await stockUpdate.save();

    res.status(200).json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
  }
};

export const getStockUpdates = async (req, res) => {
  const { productName } = req.query; 

  try {
    const query = productName ? { productName } : {}; 
    const stockUpdates = await StockUpdate.find(query).sort({ date: -1 });
    res.status(200).json(stockUpdates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock updates', error });
  }
};

export const deleteStockUpdate = async (req, res) => {
  const { id } = req.params;

  try {
    const stockUpdate = await StockUpdate.findByIdAndDelete(id);
    if (!stockUpdate) return res.status(404).json({ message: 'Stock update not found' });

    const product = await Product.findOne({ name: stockUpdate.productName });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.stockInKg -= stockUpdate.stockInKg;
    await product.save();

    res.status(200).json({ message: 'Stock update deleted successfully', stockUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stock update', error });
  }
};