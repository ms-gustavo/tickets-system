import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class UpdateTicketDTO {
  @IsString()
  @IsNotEmpty({ message: "O evento é obrigatório" })
  eventId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: "A quantidade de ingressos deve ser maior que 0" })
  amount?: number;
}
