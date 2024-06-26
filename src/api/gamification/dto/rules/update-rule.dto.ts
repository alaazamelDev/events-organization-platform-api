import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class UpdateRuleDto {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_rules', column: 'id' })
  rule_id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @IsBoolean()
  recurring: boolean;
}
