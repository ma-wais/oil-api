import Contact from '../models/Contact.js';
import Ledger from '../models/Ledger.js';
import SaleInvoice from '../models/SaleInvoice.js';

export const getSaleLedger = async (req, res) => {
  try {
    const { dateFrom, dateTo, customerName } = req.query;

    const filter = {};

    if (dateFrom && dateTo) {
      filter.date = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
    } else if (dateFrom) {
      filter.date = { $gte: new Date(dateFrom) };
    } else if (dateTo) {
      filter.date = { $lte: new Date(dateTo) };
    }

    if (customerName) {
      const decodedCustomerName = decodeURIComponent(customerName);
      const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const sanitizedCustomerName = escapeRegex(decodedCustomerName);
      filter.customerName = { $regex: sanitizedCustomerName, $options: 'i' };
    }

    const sales = await SaleInvoice.find(filter);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSaleInvoice = async (req, res) => {
  const { billNo, customerName, date, products: items, receivedCash, previousBalance, netAmount, grandTotal } = req.body;
  
  try {
    const contact = await Contact.findOne({ name: customerName});
    if (!contact) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const saleInvoice = new SaleInvoice({
      billNo,
      customerName,
      date,
      items: items.map(product => ({
        description: product.description,
        quantity: parseInt(product.quantity),
        weight: product.Unit,
        rate: parseFloat(product.rate),
        total: parseFloat(product.total)
      })),
      totalAmount: parseFloat(netAmount),
      receivedCash: parseFloat(receivedCash),
      previousBalance: parseFloat(previousBalance),
      grandTotal: parseFloat(grandTotal),
    });

    await saleInvoice.save();

    const currentDr = parseFloat(contact.openingDr || 0);
    const currentCr = parseFloat(contact.openingCr || 0);
    
    contact.openingDr = currentDr + parseFloat(netAmount) - parseFloat(receivedCash);
    
    const saleLedger = new Ledger({
      contactName: customerName,
      amount: parseFloat(netAmount),
      description: `Sale Invoice ${billNo}`,
      billNo,
      date: date || new Date(),
      type: 'dr'
    });

    if (parseFloat(receivedCash) > 0) {
      const cashLedger = new Ledger({
        contactName: customerName,
        amount: parseFloat(receivedCash),
        description: `Cash Received against ${billNo}`,
        billNo,
        date: date || new Date(),
        type: 'cr'
      });
      await cashLedger.save();
    }

    await Promise.all([contact.save(), saleLedger.save()]);

    res.status(201).json(saleInvoice);
  } catch (error) {
    console.error('Error creating sale invoice:', error);
    res.status(500).json({ message: 'Error creating sale invoice', error: error.message });
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

export const deleteSaleInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await SaleInvoice.findById(id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Sale invoice not found' });
    }

    const contact = await Contact.findOne({ name: invoice.customerName });
    if (!contact) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Ledger.deleteMany({
      contactName: invoice.customerName,
      billNo: invoice.billNo,
      $or: [
        { description: `Sale Invoice ${invoice.billNo}` },
        { description: `Cash Received against ${invoice.billNo}` }
      ]
    });

    const subtraction = invoice.totalAmount - invoice.receivedCash;
    contact.openingDr = parseFloat(contact.openingDr) - parseFloat(subtraction);
    
    await Promise.all([
      contact.save(),
      SaleInvoice.findByIdAndDelete(id)
    ]);

    return res.status(200).json({ message: 'Sale invoice and related ledger entries deleted, contact updated' });
  } catch (error) {
    console.error('Error deleting sale invoice:', error);
    return res.status(500).json({ message: 'Error deleting sale invoice', error: error.message });
  }
};
