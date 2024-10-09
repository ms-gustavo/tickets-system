import { Router } from "express";
import { PurchaseTicketsController } from "../controllers/PurchaseTicketsController";

const purchaseController = new PurchaseTicketsController();
const router = Router();

router.post("/", (req, res) => purchaseController.createPurchase(req, res));

export default router;
