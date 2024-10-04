import express from "express";
import authRoutes from "../routes/authRoutes";
import eventRoutes from "../routes/eventRoutes";
import ticketRoutes from "../routes/ticketRoutes";
import promotionRoutes from "../routes/promotionRoutes";
import { errorHandler } from "../middlewares/errorHandler.middleware";
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/tickets", ticketRoutes);
app.use("/promotions", promotionRoutes);

app.use(errorHandler);

export { app };
