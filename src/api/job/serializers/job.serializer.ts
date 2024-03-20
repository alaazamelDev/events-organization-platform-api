import { Job } from '../entities/job.entity';

export class JobSerializer {
  static serialize(job: Job): { value: number; label: string } {
    return {
      value: job.id,
      label: job.jobName,
    };
  }

  static serializeList(jobs: Job[]): { value: number; label: string }[] {
    return jobs.map((job) => this.serialize(job));
  }
}
