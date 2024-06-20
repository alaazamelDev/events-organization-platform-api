import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { GiftCardVariantEntity } from '../entities/gift-card-variant.entity';

@Injectable()
export class DeleteGiftCardVariantInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const variantID = request.params.id;

    const variant = await this.dataSource
      .getRepository(GiftCardVariantEntity)
      .createQueryBuilder('variant')
      .where('variant.id = :variantID', { variantID: +variantID })
      .leftJoinAndSelect('variant.giftCards', 'giftCard')
      .getOneOrFail();

    if (variant.giftCards.length > 0) {
      throw new BadRequestException(
        'The Variant Can not be deleted due to associated gift cards',
      );
    }

    return next.handle();
  }
}
