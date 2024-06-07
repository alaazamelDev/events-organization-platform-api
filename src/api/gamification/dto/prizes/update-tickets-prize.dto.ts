import { PartialType } from '@nestjs/swagger';
import { CreateTicketsPrizeDto } from './create-tickets-prize.dto';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { IsExist } from '../../../../common/decorators/is_exist.decorator';

export class UpdateTicketsPrizeDto extends PartialType(CreateTicketsPrizeDto) {
  @IsNotEmpty()
  @IsExist({ tableName: 'g_tickets_prizes', column: 'id' })
  tickets_prize_id: number;

  @IsOptional()
  @IsBoolean()
  enabled: boolean;

  [key: string]: any;
}
