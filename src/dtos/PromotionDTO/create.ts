import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePromotionDTO {
  @IsString()
  @IsNotEmpty({ message: "O evento para a promoção é obrigatório" })
  eventId!: string;

  @IsString()
  @IsNotEmpty({ message: "O código da promoção é obrigatório" })
  code!: string;

  @IsInt()
  @IsNotEmpty({ message: "O desconto da promoção é obrigatório" })
  discount!: number;

  @Type(() => Date)
  @IsNotEmpty({ message: "A data de expiração da promoção é obrigatória" })
  expirationDate!: Date;
}
