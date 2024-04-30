import { IsDefined, IsString, MaxLength } from 'class-validator';

export class CreateEventChatGroupDto {
  @IsDefined()
  @IsString()
  @MaxLength(30)
  group_title: string;
}
