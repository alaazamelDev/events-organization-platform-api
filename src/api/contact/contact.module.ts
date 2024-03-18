import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contact } from "./entities/contact.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [],
  providers: [ContactService],
})
export class ContactModule {}
