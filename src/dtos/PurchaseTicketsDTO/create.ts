import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreatePurchaseDTO {
  @IsString()
  @IsNotEmpty({ message: "O usuário é obrigatório" })
  userId!: string;

  @IsString()
  @IsNotEmpty({ message: "O evento é obrigatório" })
  eventId!: string;

  @IsString()
  @IsNotEmpty({ message: "O ingresso é obrigatório" })
  ticketId!: string;

  @IsInt()
  @Min(1, { message: "A quantidade de ingressos deve ser maior que 0" })
  quantity!: number;

  @IsOptional()
  @IsString()
  promotionCode?: string;
}
