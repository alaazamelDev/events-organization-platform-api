import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MulterConfigService {
  constructor(private configService: ConfigService) {}

  get dest(): string {
    return this.configService.get<string>('files.dest') ?? './public/uploads';
  }

  get allowedMimeTypes(): string[] {
    return (
      this.configService.get<string>('files.allowed_mime_types')?.split(',') ??
      []
    );
  }

  get fileSizeLimit(): number {
    return (
      this.configService.get<number>('files.file_size_limit') ??
      2 * Math.pow(1024, 2)
    ); // 1MB;
  }
}
