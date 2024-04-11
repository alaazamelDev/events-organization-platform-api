import { AttendeeContact } from '../entities/attendee-contact.entity';

export class AttendeeContactSerializer {
  static serialize(attendeeContact: AttendeeContact) {
    return {
      id: attendeeContact.id,
      contact_name: attendeeContact.contact.name,
      contact_link: attendeeContact.content,
    };
  }

  static serializeList(attendeeContacts?: AttendeeContact[]) {
    return (attendeeContacts ?? []).map((value) => this.serialize(value));
  }
}
