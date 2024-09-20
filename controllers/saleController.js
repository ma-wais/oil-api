import Contact from '../models/Contact.js';
import SaleInvoice from '../models/SaleInvoice.js';

export const createSaleInvoice = async (req, res) => {
  console.log(req.body);
  const { billNo, contact, date, products: items, receivedCash, previousBalance } = req.body;
  try {
    const contact = await Contact.findOne({contact});
    if (!contact || contact.type !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    let totalAmount = items.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const formattedReceivedCash = Number(receivedCash);
    const formattedPreviousBalance = Number(previousBalance);
    const grandTotal = totalAmount + formattedPreviousBalance;

    const saleInvoice = new SaleInvoice({
      billNo,
      contact: contactId,
      date,
      items: items.map(product => ({
        description: product.description,
        quantity: parseInt(product.quantity),
        weight: product.Unit,
        rate: parseFloat(product.rate),
        total: parseFloat(product.total)
      })),
      totalAmount,
      receivedCash: formattedReceivedCash,
      previousBalance: formattedPreviousBalance,
      grandTotal,
    });

    await saleInvoice.save();

    // Update contact balance
    const balanceDifference = grandTotal - formattedReceivedCash;
    contact.balance += balanceDifference;
    await contact.save();

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
