import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PrizeTypesEnum } from '../constants/prize-types.constant';
import { PrizeEntity } from '../entities/prizes/prize.entity';
import { CreateTicketsPrizeDto } from '../dto/prizes/create-tickets-prize.dto';
import { TicketPrizeEntity } from '../entities/prizes/ticket-prize.entity';
import { UpdateTicketsPrizeDto } from '../dto/prizes/update-tickets-prize.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RedeemPrizeDto } from '../dto/prizes/redeem-prize.dto';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { RedeemService } from './redeem.service';
import { AttendeePrizeEntity } from '../entities/prizes/attendee-prize.entity';

@Injectable()
export class GamificationPrizesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PrizeEntity)
    private readonly prizeRepository: Repository<PrizeEntity>,
    @InjectRepository(TicketPrizeEntity)
    private readonly ticketPrizeRepository: Repository<TicketPrizeEntity>,
    private readonly redeemService: RedeemService,
  ) {}

  async redeemPrize(
    redeemPrizeDto: RedeemPrizeDto,
    userID: number,
    queryRunner: QueryRunner,
  ) {
    const attendee = await this.dataSource
      .getRepository(Attendee)
      .createQueryBuilder('attendee')
      .where('attendee.user = :userID', { userID: userID })
      .getOneOrFail();

    const prizes = await Promise.all(
      redeemPrizeDto.prizes.map(async (prize) => {
        return await this.prizeRepository.findOneOrFail({
          where: { id: prize.prize_id },
        });
      }),
    );

    const results = await Promise.all(
      prizes.map(async (prize) => {
        return await this.redeemService
          .getStrategy(prize.type_id)
          .redeem(prize, attendee.id);
      }),
    );

    await Promise.all(
      results.map(async (result) => {
        for (const obj in result) {
          await queryRunner.manager.save(result[obj]);
        }
      }),
    );

    const attendeePrizes = redeemPrizeDto.prizes.map((prize) => {
      return this.dataSource.getRepository(AttendeePrizeEntity).create({
        attendee_id: attendee.id,
        prize_id: prize.prize_id,
      });
    });

    await queryRunner.manager.save(attendeePrizes);

    return 'success';
  }

  async getTicketsPrizes() {
    return await this.ticketPrizeRepository.find({
      relations: { prize: { type: true } },
    });
  }

  async createTicketsPrize(
    createTicketsPrizeDto: CreateTicketsPrizeDto,
    queryRunner: QueryRunner,
  ) {
    const prize = this.createPrize(
      createTicketsPrizeDto.name,
      createTicketsPrizeDto.rp_value,
      createTicketsPrizeDto.rank,
      PrizeTypesEnum.TICKETS,
    );

    await queryRunner.manager.save(prize, { reload: true });

    const ticketsPrize = this.dataSource
      .getRepository(TicketPrizeEntity)
      .create({
        prize: { id: prize.id } as PrizeEntity,
        tickets_value: createTicketsPrizeDto.tickets_value,
      });

    await queryRunner.manager.save(ticketsPrize);

    ticketsPrize.prize = prize;

    return ticketsPrize;
  }

  async updateTicketsPrize(
    updateTicketsPrizeDto: UpdateTicketsPrizeDto,
    queryRunner: QueryRunner,
  ) {
    const ticketsPrize = await this.ticketPrizeRepository.findOneOrFail({
      where: { id: updateTicketsPrizeDto.tickets_prize_id },
      relations: { prize: true },
    });

    const prize = await this.prizeRepository.findOneOrFail({
      where: { id: ticketsPrize.prize_id },
    });

    const updated_prize = await this.updatePrize(
      updateTicketsPrizeDto,
      prize,
      queryRunner,
    );

    await this.updateTicketsPrizeEntity(
      updateTicketsPrizeDto,
      ticketsPrize,
      queryRunner,
    );

    ticketsPrize.prize = updated_prize;

    return ticketsPrize;
  }

  async getPrizes() {
    const prizes = await this.prizeRepository.find();

    return await Promise.all(
      prizes.map(async (prize) => {
        if (Number(prize.type_id) === Number(PrizeTypesEnum.TICKETS)) {
          const tickets = await this.dataSource
            .getRepository(TicketPrizeEntity)
            .createQueryBuilder()
            .where('prize_id = :prizeID', { prizeID: prize.id })
            .getOneOrFail();

          return { ...prize, prize_details: tickets };
        }

        return prize;
      }),
    );
  }

  private createPrize(
    name: string,
    rp_value: number,
    rank: number,
    type: PrizeTypesEnum,
  ) {
    return this.dataSource.getRepository(PrizeEntity).create({
      name: name,
      rp_value: rp_value,
      type_id: type,
      rank: rank,
    });
  }

  private async updatePrize(
    dto: UpdateTicketsPrizeDto,
    prize: PrizeEntity,
    queryRunner: QueryRunner,
  ) {
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        prize[key] = value;
      }
    }

    await queryRunner.manager.save(prize);

    return prize;
  }

  private async updateTicketsPrizeEntity(
    dto: UpdateTicketsPrizeDto,
    ticketPrizeEntity: TicketPrizeEntity,
    queryRunner: QueryRunner,
  ) {
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        ticketPrizeEntity[key] = value;
      }
    }

    await queryRunner.manager.save(ticketPrizeEntity);

    return ticketPrizeEntity;
  }
}
