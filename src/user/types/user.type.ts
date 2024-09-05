import { Field, ObjectType } from "@nestjs/graphql";




@ObjectType()
export class UserResposeType{
  @Field()
  status: boolean;

  @Field()
  name: string;
}