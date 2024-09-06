import { Query, Resolver } from '@nestjs/graphql';
import { UserResposeType } from '../types';
import { UserService } from '../service/user.service';
import { User } from '../entity';

@Resolver()
export class UsersResolver {
  constructor(private userService: UserService){}


  @Query(()=> User, {name: 'findUsers'})
  public async userFind(): Promise<User>{
    const user = await this.userService.createUser();
    return user;
  }
}
