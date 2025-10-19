import express from "express";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
import {
  createProduct,
  getProducts,
  updateStock,
  getStockUpdates,
  deleteStockUpdate,
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
  deleteCrushing,
} from "../controllers/crushingController.js";
import {
  login,
  register,
  logout,
  getUser,
  changePassword,
} from "../controllers/user.js";
import {
  createContact,
  deleteContact,
  deleteLedgerRecord,
  getContacts,
  getLedgerRecords,
  getTotalBalance,
  updateBalance,
  updateContact,
} from "../controllers/Contact.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/products", auth, createProduct);
router.get("/products", auth, getProducts);
router.delete("/stock/:id", auth, deleteStockUpdate);

router.put("/stock/:name", auth, updateStock);
router.get("/stock-updates", auth, getStockUpdates);

// router.get("/sale", getSaleLedger);
// router.get("/ledger", getPurchaseLedger);
router.post("/sales", auth, createSaleInvoice);
router.get("/sales", auth, getSaleInvoices);
router.delete("/sale/:id", auth, deleteSaleInvoice);

router.post("/purchase", auth, createPurchaseInvoice);
router.get("/purchase", auth, getPurchaseInvoices);
router.delete("/purchase/:id", auth, deletePurchaseInvoice);

router.post("/crushings", auth, createCrushing);
router.get("/crushings", auth, getCrushingRecords);
router.delete("/crushing/:id", auth, deleteCrushing);

router.post("/contact", auth, createContact);
router.get("/contact", auth, getContacts);
router.put("/contact/:id", auth, updateContact);
router.delete("/contact/:id", auth, deleteContact);

router.put("/balance", auth, updateBalance);
router.get("/ledgerrecords", auth, getLedgerRecords);
router.delete("/ledgerrecord/:id", auth, deleteLedgerRecord);

router.get("/purchase/currentBillNo", auth, getNextBillNo);
router.get("/purchase/nextBillNo", auth, incrementAndGetNextBillNo);

router.get("/contacts/total-balance", auth, getTotalBalance);

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  register
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", auth, getUser);
router.post("/change", auth, changePassword);

export default router;
