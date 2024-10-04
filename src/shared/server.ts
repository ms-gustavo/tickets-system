import express from "express";
import authRoutes from "../routes/authRoutes";
import eventRoutes from "../routes/eventRoutes";
import { errorHandler } from "../middlewares/errorHandler.middleware";
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

app.use(errorHandler);

export { app };
