import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PartyService } from './service/party.service';
import { CreatePartyDto, UpdatePartyDto } from './dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo_party')) // Asegúrate de que el campo se llame 'logo'
  async createParty(
    @Body() createPartyDto: CreatePartyDto,
    @UploadedFile() file: Express.Multer.File, // Capturar el archivo
  ) {
    return this.partyService.create(createPartyDto, file);
  }

  // @Post()
  // create(@Body() createPartyDto: CreatePartyDto) {
  //   return this.partyService.create(createPartyDto);
  // }

  @Get()
  findAll() {
    return this.partyService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.partyService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartyDto: UpdatePartyDto) {
    return this.partyService.update(id, updatePartyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.partyService.remove(id);
  }
}
