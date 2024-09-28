import Contact from "../models/Contact.js";
import Ledger from "../models/Ledger.js";

export const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: "Error creating contact", error });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const contacts = await Contact.find(query);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};

export const updateBalance = async (req, res) => {
  const { name, amount, description, billNo, date } = req.body;
  try {
    const contact = await Contact.findOne({ name });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.openingDr += amount;
    await contact.save();

    const ledgerEntry = new Ledger({
      contactName: name,
      amount,
      description,
      billNo,
      date: date || new Date(),
    });
    await ledgerEntry.save();

    res.json({ contact, ledgerEntry });
  } catch (error) {
    res.status(500).json({ message: "Error updating balance", error });
  }
};

export const getLedgerRecords = async (req, res) => {
  const { dateFrom, dateTo, customerName } = req.query;

  try {
    const filter = {};
    if (dateFrom) {
      filter.date = { ...filter.date, $gte: new Date(dateFrom) };
    }
    
    if (dateTo) {
      filter.date = { ...filter.date, $lte: new Date(dateTo) };
    }
    
    if (customerName) {
      filter.contactName = { $regex: customerName, $options: 'i' };
    }

    const ledgerRecords = await Ledger.find(filter);
    res.json(ledgerRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ledger records', error });
  }
};

export const getTotalBalance = async (req, res) => {
  try {
    const contacts = await Contact.find();

    const totalDr = contacts.reduce((sum, contact) => sum + contact.openingDr, 0);
    const totalCr = contacts.reduce((sum, contact) => sum + contact.openingCr, 0);

    res.json({ totalDr, totalCr });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total balance", error });
  }
};
