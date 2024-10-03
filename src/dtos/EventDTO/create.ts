import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateEventDTO {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: "A data do evento é obrigatória" })
  date!: Date;

  @IsString()
  @IsNotEmpty({ message: "O título do evento é obrigatório" })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: "A descrição do evento é obrigatória" })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: "A localização do evento é obrigatória" })
  location!: string;

  @IsString()
  @IsNotEmpty({ message: "O criador do evento é obrigatório" })
  createdBy!: string;
}
