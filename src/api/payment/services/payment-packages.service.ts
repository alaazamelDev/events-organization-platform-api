import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from '../../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import { CreatePackageDto } from '../dto/create-package.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';
import { AddPriceToPackageDto } from '../dto/add-price-to-package.dto';
import { DataSource } from 'typeorm';
import { AttendeesTickets } from '../entities/attendees-tickets.entity';
import { TicketsEventTypes } from '../constants/tickets-event-types.constant';

@Injectable()
export class PaymentPackagesService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly dataSource: DataSource,
  ) {}

  async getPackages() {
    return this.stripe.products
      .list({ expand: ['data.default_price'] })
      .then((products) => products.data);
  }

  async createPackage(
    createPackageDto: CreatePackageDto,
    image: string | null,
  ) {
    return await this.stripe.products.create({
      name: createPackageDto.name,
      default_price_data: {
        currency: 'usd',
        unit_amount: createPackageDto.price * 100,
      },
      metadata: {
        value: createPackageDto.value,
      },
      images: image
        ? [`http://localhost:9000/api/payment/packagePicture/${image}`]
        : [],
    });
  }

  async updatePackage(updatePackageDto: UpdatePackageDto) {
    console.log(UpdatePackageDto.toObject(updatePackageDto));
    return await this.stripe.products.update(
      updatePackageDto.package_id,
      UpdatePackageDto.toObject(updatePackageDto),
    );
  }

  async addPriceToPackage(addPriceToPackageDto: AddPriceToPackageDto) {
    console.log(addPriceToPackageDto);
    return await this.stripe.prices.create({
      product: addPriceToPackageDto.package_id,
      currency: 'usd',
      unit_amount: addPriceToPackageDto.price * 100,
    });
  }

  async getPackagePrices(packageID: string) {
    return this.stripe.prices
      .list({
        product: packageID,
      })
      .then((obj) => obj.data);
  }

  async getBoughtPackages() {
    const packages = await this.getPackages();

    const ticketsBought = await this.dataSource
      .getRepository(AttendeesTickets)
      .createQueryBuilder('tickets')
      .where(`jsonb_exists(tickets.data, 'product')`)
      .andWhere('tickets.event = :eventID', {
        eventID: TicketsEventTypes.PURCHASE,
      })
      .leftJoinAndSelect('tickets.attendee', 'attendee')
      .leftJoin('attendee.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.email'])
      .getMany();

    return ticketsBought.map((ticket: any) => {
      return {
        ...ticket,
        package: packages.find((pack) => pack.id === ticket.data.product),
      };
    });
  }
}
