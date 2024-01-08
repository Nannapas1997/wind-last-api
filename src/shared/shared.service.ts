import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SharedService {
  private aesKey: string;
  constructor() {
    if (!process.env.AES_KEY) {
      throw new Error('AES_KEY environment variable is not set');
    }
    this.aesKey = process.env.AES_KEY;
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // ค่า 10 คือ "salt rounds" ซึ่งคุณสามารถปรับได้
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  encrypt(text: string): string {
    const ciphertext = CryptoJS.AES.encrypt(text, this.aesKey).toString();
    return ciphertext;
  }

  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.aesKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }
}
