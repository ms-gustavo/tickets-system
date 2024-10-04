import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { validateDTO } from "../middlewares/validate.middleware";
import { CreateEventDTO } from "../dtos/EventDTO/create";
import { authorize } from "../middlewares/authorization.middleware";
import { UpdateEventDTO } from "../dtos/EventDTO/update";

const eventController = new EventController();
const router = Router();

router.get("/all", (req, res) => eventController.getAllEvents(req, res));
router.get("/:id", (req, res) => eventController.getEventById(req, res));
router.put(
  "/:id",
  authorize("ADMIN"),
  validateDTO(UpdateEventDTO),
  (req, res) => eventController.updateEvent(req, res)
);
router.post(
  "/create",
  authorize("ADMIN"),
  validateDTO(CreateEventDTO),
  (req, res) => eventController.createEvent(req, res)
);
router.delete("/:id", authorize("ADMIN"), (req, res) =>
  eventController.deleteEvent(req, res)
);

export default router;
