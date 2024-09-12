import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types ,Schema as MoongoseSchema} from "mongoose";




@Schema({
  timestamps: true
})
export class Tenant extends Document{

  @Prop()
  name:   string;

  @Prop()
  domain: string;

  @Prop({
    isRequired: false
  })
  logo_url: string;

}

export const tenantSchema = SchemaFactory.createForClass(Tenant);