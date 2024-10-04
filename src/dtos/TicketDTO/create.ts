import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateTicketDTO {
  @IsString()
  @IsNotEmpty({ message: "O evento é obrigatório" })
  eventId!: string;

  @IsInt()
  @IsNotEmpty({ message: "O preço do ingresso é obrigatório" })
  price!: number;

  @IsString()
  @IsNotEmpty({ message: "O tipo do ingresso é obrigatório" })
  type!: string;

  @IsInt()
  @IsNotEmpty({ message: "A quantidade de ingressos é obrigatória" })
  @Min(1, { message: "A quantidade de ingressos deve ser maior que 0" })
  amount!: number;
}
