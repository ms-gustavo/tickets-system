import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { validateDTO } from "../middlewares/validate.middleware";
import { CreateEventDTO } from "../dtos/EventDTO/create";
import { authorize } from "../middlewares/authorization.middleware";

const eventController = new EventController();
const router = Router();

router.post(
  "/create",
  authorize("ADMIN"),
  validateDTO(CreateEventDTO),
  (req, res) => eventController.createEvent(req, res)
);

export default router;
