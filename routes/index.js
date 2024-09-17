import express from "express";
import {
  createProduct,
  getProducts,
  updateStock,
} from "../controllers/productController.js";
import {
  createSaleInvoice,
  getSaleInvoices,
} from "../controllers/saleController.js";
import {
  createPurchaseInvoice,
  getPurchaseInvoices,
  deletePurchaseInvoice,
} from "../controllers/purchaseController.js";
import {
  createCrushing,
  getCrushingRecords,
} from "../controllers/crushingController.js";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
import { login, register, logout, getUser, changePassword } from "../controllers/user.js";

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getProducts);
router.put("/stock/:id", updateStock);

router.post("/sales", createSaleInvoice);
router.get("/sales", getSaleInvoices);

router.post("/purchase", createPurchaseInvoice);
router.get("/purchase", getPurchaseInvoices);
router.delete("/purchase/:id", deletePurchaseInvoice);

router.post("/crushings", createCrushing);
router.get("/crushings", getCrushingRecords);

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
