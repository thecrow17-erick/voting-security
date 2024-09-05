import { Query, Resolver } from '@nestjs/graphql';
import { UserResposeType } from '../types';

@Resolver()
export class UsersResolver {
  @Query(()=>UserResposeType, {name: 'findUsers'})
  public userFind():UserResposeType{
    return {
      status: false,
      name: "Erick Blanco"
    }
  }
}
