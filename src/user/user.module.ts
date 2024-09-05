import { Module } from '@nestjs/common';
import { UsersResolver } from './controller';

@Module({
  providers: [UsersResolver]
})
export class UserModule {}
