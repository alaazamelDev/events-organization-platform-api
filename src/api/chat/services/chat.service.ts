import { Injectable } from '@nestjs/common';
import { AuthUserType } from '../../../common/types/auth-user.type';
import { UserRole } from '../../userRole/entities/user_role.entity';
import { DataSource } from 'typeorm';
import { AttendeeEvent } from '../../attend-event/entities/attendee-event.entity';
import { Attendee } from '../../attendee/entities/attendee.entity';
import { AttendeeEventStatus } from '../../attend-event/enums/attendee-event-status.enum';
import { MessageGroupStatus } from '../enums/message-group-status.enum';
import { GroupChannelType } from '../types/group-channel.type';
import { Employee } from '../../employee/entities/employee.entity';
import { GroupMessageType } from '../types/group-message.type';
import { GroupMessage } from '../entities/group-message.entity';

@Injectable()
export class ChatService {
  constructor(private readonly dataSource: DataSource) {}

  // this function is responsible for getting list of chat groups
  async getListOfChannels(user: AuthUserType): Promise<GroupChannelType[]> {
    let groupsMetaData: GroupChannelType[];
    let groups: number[] = [];
    if (user.role_id == +UserRole.ATTENDEE) {
      // get list of attendee groups.

      // get attendee Id
      const attendeeId = await this.dataSource
        .getRepository(Attendee)
        .findOneOrFail({ where: { user: { id: user.sub } } })
        .then((attendee) => attendee.id);

      groups = await this.dataSource
        .getRepository(AttendeeEvent)
        .find({
          where: {
            attendee: { id: attendeeId },
            status: AttendeeEventStatus.accepted,
            event: {
              chatGroup: { status: MessageGroupStatus.enabled },
              isChattingEnabled: true,
            },
          },
          relations: {
            event: { chatGroup: true },
          },
        })
        .then((attendeeEvents) =>
          attendeeEvents.map((ae) => ae.event.chatGroup?.id!),
        );
    } else if (user.role_id == UserRole.EMPLOYEE) {
      // get the employee id.
      const employeeId: number = await this.dataSource
        .getRepository(Employee)
        .findOneOrFail({ where: { user: { id: user.sub } } })
        .then((employee) => employee.id);

      groups = await this.dataSource
        .createQueryBuilder()
        .from(Employee, 'emp')
        .where('emp.id = :id', { id: employeeId })
        .innerJoin('emp.organization', 'org')
        .leftJoinAndSelect('org.events', 'events')
        .andWhere('events.is_chatting_enabled = :en', { en: true })
        .innerJoin('events.chatGroup', 'cg')
        .andWhere('cg.group_status = :status', {
          status: MessageGroupStatus.enabled,
        })
        .select('cg.id as group_id')
        .getRawMany()
        .then((items) => items.map((item) => item.group_id));
    }

    groupsMetaData = groups.map((groupId) => ({
      group_id: groupId,
      channel: `group-${groupId}`,
    }));

    return groupsMetaData;
  }

  async storeMessage(payload: GroupMessageType) {
    // create the new message
    const repository = this.dataSource.getRepository(GroupMessage);
    const created = repository.create({
      content: payload.content,
      senderType: payload.senderType,
      group: { id: payload.group_id },
      sender: { id: payload.sender_id },
    });

    // store it.
    const stored = await repository.save(created);

    // load fully detailed message.
    return await repository.findOne({
      where: { id: stored.id },
      relations: { sender: true, reactions: { reactedBy: true } },
      loadEagerRelations: true,
    });
  }
}
