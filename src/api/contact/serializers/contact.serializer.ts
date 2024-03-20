import { Contact } from '../entities/contact.entity';

export class ContactSerializer {
  static serialize(contact: Contact) {
    return { value: contact.id, label: contact.name };
  }

  static serializeList(contacts: Contact[]) {
    return contacts.map((contact) => this.serialize(contact));
  }
}
