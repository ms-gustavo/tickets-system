import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

class TokenService {
  generateToken(user: User) {
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }
}

export default new TokenService();
