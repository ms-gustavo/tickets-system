import { ROLE } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: `O nome é obrigatório` })
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: `O email é obrigatório` })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: `A senha é obrigatória` })
  password!: string;

  @IsEnum(ROLE)
  @IsNotEmpty({ message: `O papel é obrigatório` })
  role!: ROLE;
}
