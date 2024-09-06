import { Module } from '@nestjs/common';
import { UsersResolver } from './resolver'
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entity';
import { UserService } from './service/user.service';

@Module({
  providers: [UsersResolver, UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema
      }
    ])
  ]
})
export class UserModule {}
