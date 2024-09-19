import Product from '../models/Product.js';

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
  const { stockInKg } = req.body;

  try {
    const product = await Product.findOne({ name });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.stockInKg += Number(stockInKg);
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
  }
};
