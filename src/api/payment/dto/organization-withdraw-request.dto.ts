import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class OrganizationWithdrawRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amount: number;
}
