import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { GiftCardVariantService } from '../services/gift-card-variant.service';
import { CreateGiftCardVariantDto } from '../dto/create-gift-card-variant.dto';
import { UpdateGiftCardVariantDto } from '../dto/update-gift-card-variant.dto';
import { DeleteGiftCardVariantInterceptor } from '../interceptors/delete-gift-card-variant.interceptor';

@Controller('gift-cards/variant')
export class GiftCardsVariantController {
  constructor(
    private readonly giftCardVariantService: GiftCardVariantService,
  ) {}

  @Post()
  async createGiftCardVariant(@Body() dto: CreateGiftCardVariantDto) {
    return await this.giftCardVariantService.createVariant(dto);
  }

  @Put()
  async updateGiftCardVariant(@Body() dto: UpdateGiftCardVariantDto) {
    return await this.giftCardVariantService.updateVariant(dto);
  }

  @Delete(':id')
  @UseInterceptors(DeleteGiftCardVariantInterceptor)
  async deleteGiftCardVariant(@Param('id') variantID: string) {
    return await this.giftCardVariantService.deleteGiftCardVariant(+variantID);
  }
}
