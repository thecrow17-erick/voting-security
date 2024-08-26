import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const ugu = 1
    if(ugu === 1)
    return 'Hello World!';
  }
}
