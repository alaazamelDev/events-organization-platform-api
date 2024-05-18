import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GenericFilter } from '../../common/interfaces/query.interface';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../userRole/enums/user-role.enum';
import { User } from '../../common/decorators/user.decorator';
import { AuthUserType } from '../../common/types/auth-user.type';
import { EventSerializer } from '../event/serializers/event.serializer';
import { FileUtilityService } from '../../config/files/utility/file-utility.service';
import { Event } from '../event/entities/event.entity';
import { ArrayParamPipe } from '../../common/pipes/array-param.pipe';
import { EventQueryFilter } from '../event/interfaces/event-query.filter';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly fileUtilityService: FileUtilityService,
  ) {}

  @Get('events')
  getEvents(
    @Query() query: EventQueryFilter,
    @Query('addresses', ArrayParamPipe) addresses?: string[],
  ) {
    // Assign the transformed addresses to the DTO
    query.addresses = addresses;
    return this.feedService.getEvents(query);
  }

  @Get('soonEvents')
  getSoonEvents(@Query() query: GenericFilter) {
    return this.feedService.getSoonEvents(query);
  }

  @Get('organizations')
  getOrganizations(@Query() query: GenericFilter) {
    return this.feedService.getOrganizations(query);
  }

  @Get('popularEvents')
  async getPopularEvents(@Query() query: GenericFilter) {
    return this.feedService.getPopularEvents(query);
  }

  @Get('followedEvents')
  @Roles(UserRoleEnum.ATTENDEE)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async getEventsOfFollowedOrganizations(
    @User() user: AuthUserType,
    @Query() query: GenericFilter,
  ) {
    const events: Event[] =
      await this.feedService.getEventsOfFollowedOrganizations(user, query);
    return EventSerializer.serializeList(this.fileUtilityService, events);
  }
}
