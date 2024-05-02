import { IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddPriceToPackageDto {
  @IsNotEmpty()
  package_id: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Min(0)
  price: number;
}
