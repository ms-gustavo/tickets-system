import { Router } from "express";
import { TicketController } from "../controllers/TicketController";
import { authorize } from "../middlewares/authorization.middleware";
import { validateDTO } from "../middlewares/validate.middleware";
import { CreateTicketDTO } from "../dtos/TicketDTO/create";
import { UpdateTicketDTO } from "../dtos/TicketDTO/update";

const ticketController = new TicketController();
const router = Router();

router.get("/all/:eventId", (req, res) =>
  ticketController.getAllTicketsByEventId(req, res)
);
router.get("/:id", authorize("ADMIN"), (req, res) =>
  ticketController.getTicketById(req, res)
);
router.post(
  "/create",
  authorize("ADMIN"),
  validateDTO(CreateTicketDTO),
  (req, res) => ticketController.createTicket(req, res)
);
router.put(
  "/:id",
  authorize("ADMIN"),
  validateDTO(UpdateTicketDTO),
  (req, res) => ticketController.updateTicket(req, res)
);
router.delete("/:id", authorize("ADMIN"), (req, res) =>
  ticketController.deleteTicket(req, res)
);

export default router;
