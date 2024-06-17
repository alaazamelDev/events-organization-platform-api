import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';

@Injectable()
export class QrCodeService {
  public async generateQrCode(data: string): Promise<string> {
    try {
      return qrcode.toDataURL(data);
    } catch (error) {
      throw new Error('Failed to generate QR code.');
    }
  }
}
