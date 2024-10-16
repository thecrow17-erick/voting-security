import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Party extends Document {
  @Prop({
    unique: true,
    required: true,
    set: (value: string) => value.toLowerCase(),
  })
  name_party: string;

  @Prop({
    unique: true,
    required: true,
    set: (value: string) => value.toLocaleUpperCase(),
  })
  sigla_party: string;

  @Prop({ required: true })
  logo_party: string;

  @Prop({ set: (value: string) => value.toLowerCase() })
  description_party: string;

  @Prop({ default: true })
  status: boolean;
}

export const PartySchema = SchemaFactory.createForClass(Party);

// Esspecificar el nombre de la colección
// PartySchema.set('collection', 'parties');
