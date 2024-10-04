import { Router } from "express";
import { PromotionController } from "../controllers/PromotionController";
import { authorize } from "../middlewares/authorization.middleware";

const promotionController = new PromotionController();
const router = Router();

router.get("/all", authorize("ADMIN"), (req, res) =>
  promotionController.getAllPromotions(req, res)
);
router.get("/:id", authorize("ADMIN"), (req, res) =>
  promotionController.getPromotionById(req, res)
);
router.get("/code/:code", (req, res) =>
  promotionController.getPromotionByCode(req, res)
);
router.get("/event/:eventId", authorize("ADMIN"), (req, res) =>
  promotionController.getAllPromotionsByEventId(req, res)
);
router.post("/create", authorize("ADMIN"), (req, res) =>
  promotionController.createPromotion(req, res)
);
router.put("/:id", authorize("ADMIN"), (req, res) =>
  promotionController.updatePromotion(req, res)
);
router.delete("/:id", authorize("ADMIN"), (req, res) =>
  promotionController.deletePromotion(req, res)
);

export default router;
