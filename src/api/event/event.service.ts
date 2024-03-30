import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';
import { Event } from './entities/event.entity';
import { Organization } from '../organization/entities/organization.entity';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DB_DATE_FORMAT,
  EVENT_FILES,
} from '../../common/constants/constants';
import * as moment from 'moment';
import { Address } from '../address/entities/address.entity';
import { CreateEventTagDto } from './dto/create-event-tag.dto';
import { EventTag } from './entities/event-tag.entity';
import { EventPhoto } from './entities/event-photo.entity';
import { EventAttachment } from './entities/event-attachment.entity';
import { CreateEventAgeGroupDto } from './dto/create-event-age-group.dto';
import { EventAgeGroup } from './entities/event-age-group.entity';
import { EventDay } from './entities/event-day.entity';
import { CreateEventDaySlotDto } from './dto/create-event-day-slot.dto';
import { SlotStatus } from '../slot-status/entities/slot-status.entity';
import { EventDaySlot } from './entities/event-day-slot.entity';
import { ApprovalStatus } from '../approval-status/entities/approval-status.entity';
import { EventApprovalStatus } from './entities/event-approval-status.entity';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  private readonly dataSource: DataSource;
  private readonly employeeService: EmployeeService;

  constructor(employeeService: EmployeeService, dataSource: DataSource) {
    this.dataSource = dataSource;
    this.employeeService = employeeService;
  }

  async findEvent(id: number): Promise<Event | null> {
    return this.dataSource.manager.findOneBy(Event, { id });
  }

  // create new event
  async createEvent(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // create a transaction
      await queryRunner.startTransaction();

      const userId: number = +payload.user['sub'];
      const employee: Employee | null =
        await this.employeeService.findByUserId(userId);

      if (!employee) {
        throw new UnauthorizedException(
          "You don't have permissions to create an event!",
        );
      }

      // TODO: CHECK THE REQUIRED PERMISSIONS

      // get the Organization id from userId
      const organizationId = employee.organization.id;

      // create the event
      let data = {
        title: payload.title,
        eventType: payload.event_type,
        organization: { id: organizationId } as Organization,
        coverPictureUrl: `${EVENT_FILES}/${payload.cover_picture[0].filename}`,
        description: payload.description,
        addressNotes: payload.address_notes ?? undefined,
        capacity: payload.capacity ?? undefined,
        registrationStartDate: payload.registration_start_date
          ? moment(payload.registration_start_date).format(
              DEFAULT_DB_DATE_FORMAT,
            )
          : undefined,
        registrationEndDate: payload.registration_end_date
          ? moment(payload.registration_end_date).format(DEFAULT_DB_DATE_FORMAT)
          : undefined,
      };

      let newData;
      if (payload.location) {
        newData = { ...data, location: payload.location };
      } else {
        const address = { id: payload.address_id } as Address;
        newData = { ...data, address };
      }

      // save the main entity
      const created = queryRunner.manager.create(Event, newData);
      const savedEvent = await queryRunner.manager.save(Event, created);

      // create the event tags
      if (payload.tags && payload.tags.length > 0) {
        const eventTags = (payload.tags as Array<CreateEventTagDto>)
          .map((tag: CreateEventTagDto) => {
            return {
              event: { id: savedEvent.id },
              tag: { id: tag.tag_id },
            };
          })
          .map((tag) => {
            return queryRunner.manager.create(EventTag, tag);
          });

        // save the created tags
        await queryRunner.manager.save(EventTag, eventTags);
      }

      // create the event age groups
      if (payload.age_groups && payload.age_groups.length > 0) {
        const eventAgeGroups = (
          payload.age_groups as Array<CreateEventAgeGroupDto>
        )
          .map((ageGroup: CreateEventAgeGroupDto) => {
            return {
              event: { id: savedEvent.id },
              ageGroup: { id: ageGroup.age_group_id },
            };
          })
          .map((ageGroup) => {
            return queryRunner.manager.create(EventAgeGroup, ageGroup);
          });

        // save the created tags
        await queryRunner.manager.save(EventAgeGroup, eventAgeGroups);
      }

      // create the event photos
      if (payload.photos && payload.photos.length > 0) {
        const eventPhotos = payload.photos
          .map((photo: any) => {
            return {
              event: { id: savedEvent.id },
              photoName: `EV_${savedEvent.id}_IMG_${photo.filename}`,
              photoUrl: `${EVENT_FILES}/${photo.filename}`,
            };
          })
          .map((photo: any) => {
            return queryRunner.manager.create(EventPhoto, photo);
          });

        // save the created attachments
        await queryRunner.manager.save(EventPhoto, eventPhotos);
      }

      // create the event attachments
      if (payload.attachments && payload.attachments.length > 0) {
        const eventAttachments = payload.attachments
          .map((attachment: any) => {
            return {
              event: { id: savedEvent.id },
              fileName: `EV_${savedEvent.id}_ATT_${attachment.filename}`,
              fileUrl: `${EVENT_FILES}/${attachment.filename}`,
            };
          })
          .map((attachment: any) => {
            return queryRunner.manager.create(EventAttachment, attachment);
          });

        // save the created attachments
        await queryRunner.manager.save(EventAttachment, eventAttachments);
      }

      // create the event days
      if (payload.days && payload.days.length > 0) {
        for (const day of payload.days) {
          // store the main day entity

          const dayData = {
            event: { id: savedEvent.id },
            dayDate: moment(day.day_date, DEFAULT_DATE_FORMAT).format(
              DEFAULT_DB_DATE_FORMAT,
            ),
          };

          const createdDay = queryRunner.manager.create(EventDay, dayData);
          const savedDay = await queryRunner.manager.save(EventDay, createdDay);

          // store the slots
          if (!day.slots || day.slots.length == 0) {
            throw new BadRequestException('Day slots cannot be empty!');
          }

          const slotsData = (day.slots as Array<CreateEventDaySlotDto>)
            .map((slot: CreateEventDaySlotDto) => {
              return {
                eventDay: { id: savedDay.id },
                slotStatus: { id: SlotStatus.PENDING },
                label: slot.label,
                startTime: slot.start_time,
                endTime: slot.end_time,
              };
            })
            .map((slot) => {
              return queryRunner.manager.create(EventDaySlot, slot);
            });

          // save them all
          await queryRunner.manager.save(EventDaySlot, slotsData);
        }
      }

      // create a default approval status entity
      const eventApprovalStatusData = {
        approvalStatus: { id: ApprovalStatus.IN_REVIEW },
        event: { id: savedEvent.id },
        setBy: { id: userId },
        fromDate: new Date(),
      };

      const createdApprovalStatus = queryRunner.manager.create(
        EventApprovalStatus,
        eventApprovalStatusData,
      );
      await queryRunner.manager.save(
        EventApprovalStatus,
        createdApprovalStatus,
      );

      // commit the transaction
      await queryRunner.commitTransaction();

      return await queryRunner.manager.findOne(Event, {
        where: { id: savedEvent.id },
      });
    } catch (e) {
      // rollback the transaction
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  async updateEventData(payload: any): Promise<Event | null> {
    // check for existence
    if (!(await this.checkEventExistence(payload.id))) {
      throw new NotFoundException(`Event with Id=${payload.id} was not found!`);
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      // update the entry
      await queryRunner.manager.update(
        Event,
        { id: payload.id },
        UpdateEventDto.toModel(payload),
      );

      await queryRunner.commitTransaction();
      return this.findEvent(payload.id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    }
  }

  private async checkEventExistence(id: number): Promise<boolean> {
    try {
      const event = await this.dataSource.manager.findOneByOrFail(Event, {
        id,
      });
      return !!event;
    } catch (e) {
      return false;
    }
  }
}
