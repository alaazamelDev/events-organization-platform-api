import { IsDefined, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsDefined()
  @IsString()
  longitude: number;

  @IsDefined()
  @IsString()
  latitude: number;
}
