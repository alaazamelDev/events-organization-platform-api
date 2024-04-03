import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDayRequest } from './dto/create-event-day.request';
import { UpdateEventDayRequest } from './dto/update-event-day.request';
import { DataSource } from 'typeorm';
import { EventDay } from './entities/event-day.entity';
import { DEFAULT_DB_DATE_FORMAT } from '../../common/constants/constants';
import * as moment from 'moment';
import { EventDaySlot } from '../event/entities/event-day-slot.entity';

@Injectable()
export class EventDayService {
  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async create(createEventDayDto: CreateEventDayRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      // create the main entity
      const created = queryRunner.manager.create(EventDay, {
        event: { id: createEventDayDto.event_id },
        dayDate: moment(createEventDayDto.day_date).format(
          DEFAULT_DB_DATE_FORMAT,
        ),
      });
      const saved = await queryRunner.manager.save(EventDay, created);

      // create the slots
      if (createEventDayDto.slots.length == 0) {
        throw new BadRequestException('slots cannot be empty');
      }

      const createdSlots = createEventDayDto.slots
        .map((slot) => {
          return {
            eventDay: { id: saved.id },
            label: slot.label,
            startTime: slot.start_time,
            endTime: slot.end_time,
          };
        })
        .map((item) => {
          return queryRunner.manager.create(EventDaySlot, item);
        });

      await queryRunner.manager.save(EventDaySlot, createdSlots);
      await queryRunner.commitTransaction();
      return this.findOne(saved.id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  findAll() {
    return `This action returns all eventDay`;
  }

  findOne(id: number) {
    return this.dataSource.manager.findOneBy(EventDay, { id });
  }

  async update(id: number, updateEventDayDto: UpdateEventDayRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      if (updateEventDayDto.day_date) {
        await queryRunner.manager.update(
          EventDay,
          { id },
          {
            dayDate: updateEventDayDto.day_date,
          },
        );
      }

      if (updateEventDayDto.slots) {
        // delete the old ones.
        await this.dataSource
          .createQueryBuilder(queryRunner)
          .delete()
          .from(EventDaySlot)
          .where('event_day_id = :event_day_id')
          .setParameters({ event_day_id: id })
          .execute();

        // insert the new ones
        const createdSlots = updateEventDayDto.slots
          .map((item) => {
            return {
              eventDay: { id: id },
              label: item.label,
              startTime: item.start_time,
              endTime: item.end_time,
            };
          })
          .map((item) => {
            return queryRunner.manager.create(EventDaySlot, item);
          });

        await queryRunner.manager.save(EventDaySlot, createdSlots);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} eventDay`;
  }
}
