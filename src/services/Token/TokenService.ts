import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

class TokenService {
  generateToken(user: User) {
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return token;
  }
}

export default new TokenService();
