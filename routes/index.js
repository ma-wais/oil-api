import express from "express";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
import {
  createProduct,
  getProducts,
  updateStock,
  getStockUpdates
} from "../controllers/productController.js";
import {
  createSaleInvoice,
  deleteSaleInvoice,
  getSaleInvoices,
  getSaleLedger,
} from "../controllers/saleController.js";
import {
  createPurchaseInvoice,
  getPurchaseInvoices,
  deletePurchaseInvoice,
  getPurchaseLedger,
  getNextBillNo,
  incrementAndGetNextBillNo,
} from "../controllers/purchaseController.js";
import {
  createCrushing,
  getCrushingRecords,
} from "../controllers/crushingController.js";
import { login, register, logout, getUser, changePassword } from "../controllers/user.js";
import { createContact, deleteContact, getContacts, getLedgerRecords, getTotalBalance, updateBalance, updateContact } from "../controllers/Contact.js";

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getProducts);
router.put("/stock/:name", updateStock);
router.get("/stock-updates", getStockUpdates);

router.get('/sale', getSaleLedger);
router.post("/sales", createSaleInvoice);
router.get("/sales", getSaleInvoices);
router.delete("/sale/:id", deleteSaleInvoice);

router.get('/ledger', getPurchaseLedger);
router.post("/purchase", createPurchaseInvoice);
router.get("/purchase", getPurchaseInvoices);
router.delete("/purchase/:id", deletePurchaseInvoice);

router.post("/crushings", createCrushing);
router.get("/crushings", getCrushingRecords);

router.post("/contact", createContact);
router.get("/contact", getContacts);
router.put("/contact/:id", updateContact);
router.delete("/contact/:id", deleteContact);

router.put("/balance", updateBalance);
router.get('/ledgerrecords', getLedgerRecords);

router.get('/purchase/currentBillNo', getNextBillNo);
router.get('/purchase/nextBillNo', incrementAndGetNextBillNo);

router.get('/contacts/total-balance', getTotalBalance);

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  register
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", auth, getUser);
router.post("/change", auth, changePassword);

export default router;
