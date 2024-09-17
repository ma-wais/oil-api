import SaleInvoice from '../models/SaleInvoice.js';
import Product from '../models/Product.js';

export const createSaleInvoice = async (req, res) => {
  const { billNo, customerName, date, products: items, receivedCash, previousBalance } = req.body;

  try {
    let totalAmount = 0;

    const formattedReceivedCash = Number(receivedCash);
    const formattedPreviousBalance = Number(previousBalance);
    
    for (const item of items) {
      const product = await Product.findOne({ name: item.description });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.description} not found` });
      }
      
      const formattedWeight = Number(item.quantity);
      const formattedRate = Number(item.rate);
    
      if (isNaN(formattedWeight) || isNaN(formattedRate)) {
        return res.status(400).json({ message: "Invalid quantity or rate value" });
      }
    
      if (product.stockInKg < formattedWeight) {
        return res.status(400).json({ message: `Insufficient stock for ${item.description}` });
      }
    
      product.stockInKg -= formattedWeight;
      await product.save();
    
      item.total = formattedWeight * formattedRate;
      totalAmount += item.total;
    }
    

    const grandTotal = totalAmount - formattedReceivedCash + formattedPreviousBalance;

    const saleInvoice = new SaleInvoice({
      billNo,
      customerName,
      date,
      items: items.map(product => ({
        description: product.description,
        quantity: parseInt(product.quantity),
        weight: parseFloat(product.weight),
        rate: parseFloat(product.rate),
        total: parseFloat(product.total)
      })),
      totalAmount,
      receivedCash: formattedReceivedCash,
      previousBalance: formattedPreviousBalance,
      grandTotal,
    });

    await saleInvoice.save();
    res.status(201).json(saleInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale invoice', error });
  }
};

export const getSaleInvoices = async (req, res) => {
  try {
    const { startDate, endDate, billNo, customerName, itemName } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (billNo) {
      query.billNo = billNo;
    }

    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }

    if (itemName) {
      query['items.description'] = { $regex: itemName, $options: 'i' };
    }

    const invoices = await SaleInvoice.find(query);
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale report', error });
  }
};
