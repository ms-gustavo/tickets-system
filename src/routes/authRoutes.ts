import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateDTO } from "../middlewares/validate.middleware";
import { CreateUserDTO } from "../dtos/UserDTO/create";
import { LoginUserDTO } from "../dtos/UserDTO/login";

const authController = new AuthController();
const router = Router();

router.post("/register", validateDTO(CreateUserDTO), (req, res) =>
  authController.register(req, res)
);

router.post("/login", validateDTO(LoginUserDTO), (req, res) =>
  authController.login(req, res)
);

export default router;
