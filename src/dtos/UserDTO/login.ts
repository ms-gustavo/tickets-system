import { IsEmail, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty({ message: `O email é obrigatório` })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: `A senha é obrigatória` })
  password!: string;
}
