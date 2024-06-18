import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { STRIPE_CLIENT } from '../stripe/constants/stripe.constants';
import { Stripe } from 'stripe';
import e, { Request, Response } from 'express';
import { CheckoutDto } from './dto/checkout.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { CheckoutInterceptor } from './interceptors/checkout.interceptor';
import { PaymentAttendeeService } from './services/payment-attendee.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { PaymentPackagesService } from './services/payment-packages.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { of } from 'rxjs';
import * as process from 'process';
import { UpdatePackageDto } from './dto/update-package.dto';
import { AddPriceToPackageDto } from './dto/add-price-to-package.dto';
import { PaymentOrganizationService } from './services/payment-organization.service';
import { DidAttendeePayedForTheEventDto } from './dto/did-attendee-payed-for-the-event.dto';
import { OrganizationWithdrawRequestDto } from './dto/organization-withdraw-request.dto';
import { User } from '../../common/decorators/user.decorator';
import { AuthUserType } from '../../common/types/auth-user.type';
import { ManageOrganizationWithdrawRequestDto } from './dto/manage-organization-withdraw-request.dto';
import { TransactionInterceptor } from '../../common/interceptors/transaction/transaction.interceptor';
import { QueryRunnerParam } from '../../common/decorators/query-runner-param.decorator';
import { QueryRunner } from 'typeorm';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentAttendeeService: PaymentAttendeeService,
    private readonly paymentPackagesService: PaymentPackagesService,
    private readonly paymentOrganizationService: PaymentOrganizationService,
    @Inject(STRIPE_CLIENT)
    private readonly stripe: Stripe,
  ) {}

  @Get('organization/:id/withdraw/requests')
  async getOrganizationWithdrawRequests(@Param('id') orgID: string) {
    return this.paymentOrganizationService.getOrganizationWithdrawRequests(
      +orgID,
    );
  }

  @Get('organization/withdraw/requests')
  async getWithdrawRequests() {
    return this.paymentOrganizationService.getWithdrawRequests();
  }

  @Post('organization/withdraw')
  @Roles(UserRoleEnum.EMPLOYEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async organizationWithdrawRequest(
    @Body() organizationWithdrawRequestDto: OrganizationWithdrawRequestDto,
    @User() user: AuthUserType,
  ) {
    return this.paymentOrganizationService.organizationWithdrawRequest(
      organizationWithdrawRequestDto,
      +user.sub,
    );
  }

  @Post('organization/withdraw/manage')
  @UseInterceptors(TransactionInterceptor)
  async manageOrganizationWithdrawRequest(
    @Body() dto: ManageOrganizationWithdrawRequestDto,
    @QueryRunnerParam() queryRunner: QueryRunner,
  ) {
    return this.paymentOrganizationService.manageOrganizationWithdrawRequest(
      dto,
      queryRunner,
    );
  }

  @Get('packages-history')
  async getPackagesHistory() {
    return this.paymentPackagesService.getBoughtPackages();
  }

  @Get('tickets-usage')
  async getTicketsUsage() {
    return this.paymentAttendeeService.getTicketsUsage();
  }

  @Post('stripe/webhook')
  async stripeEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const local_ws =
        'whsec_cc93fc5e334d04df1b259c66ed98ec6d32425ec8bf0dd888ff1a7033673e12fb';

      const event = this.stripe.webhooks.constructEvent(
        req.rawBody ? req.rawBody : '',
        signature,
        process.env.STRIPE_WEBHOOK_KEY
          ? process.env.STRIPE_WEBHOOK_KEY
          : local_ws,
      );

      switch (event.type) {
        case 'checkout.session.completed':
          const sessionWithLineItems =
            await this.stripe.checkout.sessions.retrieve(event.data.object.id, {
              expand: ['line_items', 'line_items.data.price.product'],
            });

          const email = sessionWithLineItems.customer_details?.email;
          const items = sessionWithLineItems.line_items?.data;
          await this.paymentService.fulfillTicketsOrder(
            email ? email : '',
            items ? items : [],
          );
          break;
        default:
          console.log('unsupported event type');
      }

      res.status(200).end();
    } catch (e) {
      res.status(400).end();
      throw new BadRequestException(`Webhook Error`);
    }
  }

  @Post('checkout')
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @UseInterceptors(CheckoutInterceptor)
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.paymentService.checkout(checkoutDto);
  }

  @Get('packages')
  getPackages() {
    return this.paymentPackagesService.getPackages();
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/packages/images',
        filename(
          _req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

          const extension = path.parse(file.originalname).ext;

          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @Post('packages/create')
  createPackage(
    @Body() createPackageDto: CreatePackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.paymentPackagesService.createPackage(
      createPackageDto,
      file ? file.filename : null,
    );
  }

  @Patch('packages/update')
  updatePackage(@Body() updatePackageDto: UpdatePackageDto) {
    return this.paymentPackagesService.updatePackage(updatePackageDto);
  }

  @Post('packages/addPrice')
  addPriceToPackage(@Body() addPriceToPackageDto: AddPriceToPackageDto) {
    return this.paymentPackagesService.addPriceToPackage(addPriceToPackageDto);
  }

  @Get('packages/:id/prices')
  getPackagePrices(@Param('id') packageID: string) {
    return this.paymentPackagesService.getPackagePrices(packageID);
  }

  @Get('attendee/payed-for-event')
  didAttendeePayedForEvent(@Query() query: DidAttendeePayedForTheEventDto) {
    return this.paymentAttendeeService.didAttendeePayedForTheEvent(query);
  }

  @Get('attendee/balance/:id')
  getAttendeeTicketsBalance(@Param('id') id: string) {
    return this.paymentAttendeeService.getAttendeeTicketsBalance(+id);
  }

  @Get('attendee/:id/ticketsHistory')
  getAttendeeTicketsHistory(@Param('id') id: string) {
    return this.paymentAttendeeService.getAttendeeTicketsHistory(+id);
  }

  @Get('organization/balance/:id')
  getOrganizationTicketsBalance(@Param('id') id: string) {
    return this.paymentOrganizationService.getOrganizationTicketsBalance(+id);
  }

  @Get('organization/:id/ticketsHistory')
  getOrganizationTicketsHistory(@Param('id') id: string) {
    return this.paymentOrganizationService.getOrganizationTicketsHistory(+id);
  }

  @Get('packagePicture/:imageName')
  getOrganizationCoverPicture(
    @Param('imageName') imageName: string,
    @Res() res: any,
  ) {
    return of(
      res.sendFile(
        path.join(process.cwd(), 'uploads/packages/images/' + imageName),
      ),
    );
  }
}
