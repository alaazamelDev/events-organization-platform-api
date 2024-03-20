import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../app/config.service';

@Injectable()
export class FileUtilityService {
  private readonly appConfigService: AppConfigService;

  constructor(appConfigService: AppConfigService) {
    this.appConfigService = appConfigService;
  }

  getFileUrl(fileUrl: string | null | undefined): string | null {
    // null check
    if (!fileUrl) {
      return null;
    }

    // get the app base url
    const appBaseUrl = this.appConfigService.url;
    if (!appBaseUrl) {
      throw new Error('APP_URL is not configured.');
    }

    // Ensure app base URL ends with a slash
    const baseUrl = appBaseUrl.endsWith('/') ? appBaseUrl : appBaseUrl + '/';

    // Remove leading slashes from file URL
    const cleanFileUrl = fileUrl.replace(/^\//, '');

    return `${baseUrl}${cleanFileUrl}`;
  }
}
