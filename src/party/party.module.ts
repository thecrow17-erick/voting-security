import { Module } from '@nestjs/common';
import { PartyService } from './service/party.service';
import { PartyController } from './party.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from './entities/party.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [PartyController],
  providers: [PartyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Party.name,
        schema: PartySchema,
        collection: 'parties', // especicamos nombre de la coleccion
      },
    ]),
    CloudinaryModule,
  ],
})
export class PartyModule {}
