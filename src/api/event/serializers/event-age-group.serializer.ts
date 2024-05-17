import { EventAgeGroup } from '../entities/event-age-group.entity';

export class EventAgeGroupSerializer {
  static serialize(eventAgeGroup: EventAgeGroup) {
    const from = eventAgeGroup.ageGroup.fromAge;
    const to = eventAgeGroup.ageGroup.toAge;

    let name: string = `${from} - ${to}`;
    if (!from) {
      name = `<= ${to}`;
    } else if (!to) {
      name = `>= ${from}`;
    }

    return {
      event_age_group_id: eventAgeGroup.id,
      age_group_id: eventAgeGroup.ageGroup.id,
      age_group_name: name,
    };
  }

  static serializeList(eventAgeGroups?: EventAgeGroup[]) {
    if (!eventAgeGroups) return [];
    return eventAgeGroups.map((ageGroup) => this.serialize(ageGroup));
  }
}
