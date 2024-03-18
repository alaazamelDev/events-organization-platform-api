import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DBConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('db.host') ?? 'localhost';
  }

  get database(): string {
    return this.configService.get<string>('db.name') ?? 'postgres';
  }

  get user(): string {
    return this.configService.get<string>('db.user') ?? 'postgres';
  }

  get password(): string {
    return this.configService.get<string>('db.password') ?? '';
  }

  get port(): number {
    return Number(this.configService.get<number>('db.port'));
  }
}
