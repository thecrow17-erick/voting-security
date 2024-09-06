import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@ObjectType()
@Schema({timestamps: true})
export class User {
  @Field()
  @Prop()
  username: string;

  @Field()
  @Prop()
  email: string;

  @Field()
  @Prop()
  password: string


  @Field()
  @Prop({default: null})
  img_url: string;
}



export const userSchema = SchemaFactory.createForClass(User); 