import { IsNotEmpty, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Min(1)
  value: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Min(0)
  price: number;
}
