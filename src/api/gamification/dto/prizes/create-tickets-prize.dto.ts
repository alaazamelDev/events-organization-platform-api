import { CreatePrizeDto } from './create-prize.dto';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateTicketsPrizeDto extends CreatePrizeDto {
  @IsNotEmpty()
  @Min(1)
  tickets_value: number;
}
