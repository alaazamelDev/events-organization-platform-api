import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty()
  price_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty({ message: 'could not proceed payment operation' })
  stripe_id: string;
}
