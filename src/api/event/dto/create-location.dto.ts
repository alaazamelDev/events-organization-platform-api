import { IsDecimal, IsDefined } from 'class-validator';

export class CreateLocationDto {
  @IsDefined()
  @IsDecimal()
  longitude: number;

  @IsDefined()
  @IsDecimal()
  latitude: number;
}
