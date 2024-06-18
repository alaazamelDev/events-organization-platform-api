import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class GiftCardService {
  private readonly salt: string;

  constructor() {
    this.salt = '8a1c89b874883f9e63c3d3a89f7d0bba'; // Replace with your actual secret salt
  }

  generateGiftCardCode(): string {
    const serialNumber = this.generateSerialNumber(); // Generate a more variable serial number
    const hash = this.hashSerialNumber(serialNumber);
    const alphanumericCode = this.encode(serialNumber, hash);
    const shuffled = alphanumericCode
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
    return shuffled;
  }

  verifyGiftCardCode(code: string): boolean {
    const { serialNumber, hash } = this.decode(code);
    const expectedHash = this.hashSerialNumber(serialNumber);
    return hash === expectedHash;
  }

  private generateSerialNumber(): string {
    const timestamp = Date.now().toString(36); // Base36 encoding of timestamp
    const randomComponent = Math.floor(Math.random() * 16111179616).toString(
      36,
    ); // Base36 encoding of random number (6 characters max)
    return timestamp + randomComponent.padStart(6, '0'); // Ensure it's 6 characters
  }

  private hashSerialNumber(serialNumber: string): string {
    const data = `${serialNumber}${this.salt}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash.slice(-16); // Use the last 16 characters (64 bits)
  }

  private encode(serialNumber: string, hash: string): string {
    const buffer = Buffer.from(`${serialNumber}-${hash}`);
    const base32Code = base32Encode(buffer);
    return base32Code.toUpperCase().slice(0, 25); // Ensure the code is 25 characters long
  }

  private decode(code: string): { serialNumber: string; hash: string } {
    const buffer = base32Decode(code);
    const decoded = buffer.toString('utf-8');
    const [serialNumber, hash] = decoded.split('-');
    return { serialNumber, hash };
  }
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(input: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < input.length; i++) {
    value = (value << 8) | input[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(input: string): Buffer {
  let bits = 0;
  let value = 0;
  let output = [];

  for (let i = 0; i < input.length; i++) {
    const index = BASE32_ALPHABET.indexOf(input[i].toUpperCase());
    if (index === -1) {
      throw new Error('Invalid Base32 character');
    }
    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}
