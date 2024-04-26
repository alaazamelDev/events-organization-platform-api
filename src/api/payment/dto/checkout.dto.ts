import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty()
  price_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  // to delete
  user_id: number;
}
