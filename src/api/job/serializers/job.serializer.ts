import { Job } from '../entities/job.entity';

export class JobSerializer {
  static serialize(job?: Job): { value: number; label: string } | null {
    if (!job) {
      return null;
    }
    return {
      value: job.id,
      label: job.jobName,
    };
  }

  static serializeList(
    jobs: Job[],
  ): ({ value: number; label: string } | null)[] {
    return jobs.map((job) => this.serialize(job));
  }
}
