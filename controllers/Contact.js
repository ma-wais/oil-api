import Contact from "../models/Contact.js";
import Ledger from "../models/Ledger.js";

export const createContact = async (req, res) => {
  try {
    console.log(req.body);
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

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const contact = await Contact.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: "Error updating contact", error });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
};

export const updateBalance = async (req, res) => {
  const { name, amount, description, billNo, date, type } = req.body;
  try {
    const contact = await Contact.findOne({ name });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (type === "cr") {
      contact.openingCr += amount;
    } else if (type === "dr") {
      contact.openingDr += amount;
    }

    await contact.save();

    const ledgerEntry = new Ledger({
      contactName: name,
      amount,
      description,
      billNo,
      date: date || new Date(),
      type,
    });
    await ledgerEntry.save();

    res.json({ contact, ledgerEntry });
  } catch (error) {
    res.status(500).json({ message: "Error updating balance", error });
  }
};

export const getLedgerRecords = async (req, res) => {
  let {
    dateFrom = "1970-01-01",
    dateTo = new Date().toISOString().split("T")[0],
    customerName,
  } = req.query;

  console.log("Raw query params:", req.query);
  console.log(
    "Processed dateFrom:",
    dateFrom,
    "dateTo:",
    dateTo,
    "customerName:",
    customerName
  );

  try {
    const filter = {};

    if (dateFrom) {
      filter.date = { ...filter.date, $gte: new Date(dateFrom) };
    }
    if (dateTo) {
      filter.date = { ...filter.date, $lte: new Date(dateTo) };
    }

    if (customerName) {
      const decodedCustomerName = decodeURIComponent(customerName);
      const escapeRegex = (string) =>
        string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const sanitizedCustomerName = escapeRegex(decodedCustomerName);
      filter.contactName = { $regex: sanitizedCustomerName, $options: "i" };
    }

    const ledgerRecords = await Ledger.find(filter)
      .populate("saleInvoice")
      .populate("purchaseInvoice");

    res.json(ledgerRecords);
  } catch (error) {
    console.error("Error fetching ledger records:", error);
    res.status(500).json({ message: "Error fetching ledger records", error });
  }
};

export const deleteLedgerRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecord = await Ledger.findById(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Ledger record not found" });
    }

    const contact = await Contact.findOne({ name: deletedRecord.contactName });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (deletedRecord.type === "dr") {
      contact.openingDr = Math.max(0, contact.openingDr - deletedRecord.amount);
    } else if (deletedRecord.type === "cr") {
      contact.openingCr = Math.max(0, contact.openingCr - deletedRecord.amount);
    }

    await contact.save();
    await Ledger.findByIdAndDelete(id);
    res.json({ message: "Ledger record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ledger record", error });
  }
};

export const getTotalBalance = async (req, res) => {
  try {
    const contacts = await Contact.find();

    let totalDr = 0;
    let totalCr = 0;

    contacts.forEach((contact) => {
      const netBalance = contact.openingDr - contact.openingCr;
      if (netBalance > 0) {
        totalDr += netBalance;
      } else {
        totalCr += Math.abs(netBalance);
      }
    });

    res.json({ totalDr, totalCr });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total balance", error });
  }
};
