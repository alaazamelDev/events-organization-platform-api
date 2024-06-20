import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RedeemGiftCardDto } from '../dto/redeem-gift-card.dto';
import { GiftCardRedeemService } from '../services/gift-card-redeem.service';
import { TransactionInterceptor } from '../../../common/interceptors/transaction/transaction.interceptor';
import { CheckGiftCardCodeValidityInterceptor } from '../interceptors/check-gift-card-code-validity.interceptor';
import { QueryRunnerParam } from '../../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../userRole/enums/user-role.enum';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { RoleGuard } from '../../../common/guards/role/role.guard';
import { User } from '../../../common/decorators/user.decorator';
import { AuthUserType } from '../../../common/types/auth-user.type';

@Controller('gift-cards/redeem')
export class GiftCardsRedeemController {
  constructor(private readonly giftCardRedeemService: GiftCardRedeemService) {}

  @Post()
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(TransactionInterceptor, CheckGiftCardCodeValidityInterceptor)
  async redeemGiftCard(
    @Body() dto: RedeemGiftCardDto,
    @User() user: AuthUserType,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return await this.giftCardRedeemService.redeemGiftCard(
      dto,
      +user.sub,
      queryRunner,
    );
  }
}
