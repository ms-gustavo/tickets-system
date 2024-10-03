import express from "express";
import authRoutes from "../routes/authRoutes";
import eventRoutes from "../routes/eventRoutes";
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

export { app };
