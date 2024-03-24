import { AgeGroup } from '../entities/age-group.entity';

export class AgeGroupSerializer {
  static serialize(ageGroup: AgeGroup): { value: number; label: string } {
    const from = ageGroup.fromAge;
    const to = ageGroup.toAge;
    return {
      value: ageGroup.id,
      label: `${from}, ${to}`,
    };
  }

  static serializeList(
    ageGroup: AgeGroup[],
  ): { value: number; label: string }[] {
    return ageGroup.map((ageGroup) => this.serialize(ageGroup));
  }
}
