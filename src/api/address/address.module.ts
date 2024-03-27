import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { DataSource } from 'typeorm';
import { addressRepository } from './repositories/address.repository';
import { AddressService } from './services/address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [
    AddressService,
    {
      //? INJECT THE CUSTOM REPOSITORY.
      provide: getRepositoryToken(Address),
      inject: [getDataSourceToken()],
      useFactory: function (datasource: DataSource) {
        return datasource.getRepository(Address).extend(addressRepository);
      },
    },
  ],
  exports: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
