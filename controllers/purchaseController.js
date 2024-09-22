import Contact from '../models/Contact.js';
import PurchaseInvoice from '../models/PurchaseInvoice.js';

export const createPurchaseInvoice = async (req, res) => {
  console.log(req.body);
  const { 
    billNo, 
    date, 
    customerName, 
    carNo, 
    carRent, 
    gojarkhanWeight, 
    receivedWeight, 
    nag, 
    previousBalance, 
    products, 
    netAmount, 
    grandTotal 
  } = req.body;

  try {
    const contact = await Contact.findOne({ name: customerName, type: 'party' });
    if (!contact) {
      return res.status(404).json({ message: 'Party not found' });
    }

    const purchaseInvoice = new PurchaseInvoice({
      invoiceNumber: billNo,
      date: new Date(date),
      partyName: customerName,
      items: products.map(product => ({
        description: product.description,
        quantity: parseInt(product.quantity),
        weight: product.Unit,
        rate: parseFloat(product.rate),
        total: parseFloat(product.total)
      })),
      details: {
        carNo,
        carRent: parseFloat(carRent),
        gojarkhanWeight: parseFloat(gojarkhanWeight),
        receivedWeight: parseFloat(receivedWeight),
        nag: parseInt(nag),
      },
      totalAmount: parseFloat(netAmount),
      previousBalance: parseFloat(previousBalance),
      grandTotal: parseFloat(grandTotal),
    });

    await purchaseInvoice.save();

    contact.openingDr += parseFloat(grandTotal);
    await contact.save();

    return res.status(201).json(purchaseInvoice);
  } catch (error) {
    console.error('Error creating purchase invoice:', error);
    return res.status(500).json({ message: 'Error creating purchase invoice', error: error.message });
  }
};

export const getPurchaseInvoices = async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase invoices', error });
  }
};

export const deletePurchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await PurchaseInvoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice', error });
  }
};

export const editPurchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await PurchaseInvoice.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    } 
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error });
  }
};
