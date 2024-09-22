import Contact from "../models/Contact.js";

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
  const { name, amount } = req.body;
  try {
    const contact = await Contact.findOne({ name });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    console.log(contact)
    contact.openingDr += amount;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error updating balance", error });
  }
};
