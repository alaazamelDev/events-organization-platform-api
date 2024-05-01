import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import * as process from 'process';

@Controller('health')
export class HealthController {
  @Get()
  @HealthCheck()
  check(): string {
    return 'Service is up';
  }

  @Get('memoryUsage')
  memoryUsage() {
    const usage = process.memoryUsage();

    return {
      heap_total:
        Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100 + 'MB',
      heap_usage: Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100 + 'MB',
    };
  }
}
