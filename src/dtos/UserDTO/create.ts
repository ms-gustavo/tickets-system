import { IsEmail, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: `O nome é obrigatório` })
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: `O email é obrigatório` })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: `A senha é obrigatória` })
  @Min(6, { message: `A senha deve ter no mínimo 6 caracteres` })
  @Max(20, { message: `A senha deve ter no máximo 20 caracteres` })
  password!: string;
}
