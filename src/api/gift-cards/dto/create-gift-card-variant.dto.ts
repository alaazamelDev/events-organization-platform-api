import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateGiftCardVariantDto {
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @Min(1)
  tickets: number;
}
