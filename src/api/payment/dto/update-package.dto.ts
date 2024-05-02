import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePackageDto {
  @IsNotEmpty()
  package_id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  value?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  default_price: string;

  [key: string]: any;

  static toObject(updatePackageDto: UpdatePackageDto) {
    const obj: LooseObject = {};
    for (const key in updatePackageDto) {
      if (key === 'value' && updatePackageDto[key]) {
        obj.metadata = { value: updatePackageDto[key] };
      } else if (key !== 'package_id' && updatePackageDto[key]) {
        obj[key] = updatePackageDto[key];
      }
    }

    return obj;
  }
}
