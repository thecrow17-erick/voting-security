import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartyDto, UpdatePartyDto } from '../dto';
import { Party } from '../entities';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class PartyService {
  [x: string]: any;
  constructor(
    @InjectModel(Party.name) private partyModel: Model<Party>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createPartyDto: CreatePartyDto,
    file: Express.Multer.File,
  ): Promise<Party> {
    // Verificar si el partido ya existe
    const exists = await this.partyExists(
      createPartyDto.name_party,
      createPartyDto.sigla_party,
    );
    if (exists) {
      throw new ConflictException(
        'Party with the same name or sigla already exists',
      );
    }

    try {
      // Subir el logo a Cloudinary y obtener la URL
      const uploadResult = await this.cloudinaryService.uploadFile(file);

      // Asignar la URL del logo a createPartyDto.logo_party
      createPartyDto.logo_party = uploadResult.secureUrl;

      // Crear el partido con los detalles actualizados
      const newParty = new this.partyModel(createPartyDto);

      await newParty.save();
      return newParty;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // Obtener todos los partidos
  async findAll(): Promise<Party[]> {
    return this.partyModel.find().exec();
  }

  // Obtener un partido por su ID, nombre o sigla
  async findOne(term: string) {
    let party: Party = null;

    if (isValidObjectId(term)) {
      party = await this.partyModel.findById(term).exec();
    }

    if (!party) {
      party = await this.partyModel
        .findOne({
          name_party: term.toLowerCase().trim(),
        })
        .exec();
    }

    if (!party) {
      party = await this.partyModel
        .findOne({
          sigla_party: term.toLowerCase().trim(),
        })
        .exec();
    }

    if (!party) {
      throw new NotFoundException(`Party with identifier "${term}" not found`);
    }

    return party;
  }

  // Actualizar un partido por su ID,
  async update(
    id: string,
    updatePartyDto: UpdatePartyDto,
    file?: Express.Multer.File,
  ): Promise<Party> {
    // Verificar si el partido existe
    const party = await this.partyModel.findById(id);
    if (!party) {
      throw new NotFoundException(`Party with ID ${id} not found`);
    }

    if (file) {
      if (party.logo_party) {
        const publicId = this.extractPublicIdFromUrl(party.logo_party);
        await this.cloudinaryService.deleteImage(publicId);
      }

      const uploadResult = await this.cloudinaryService.uploadFile(file);
      updatePartyDto.logo_party = uploadResult.secureUrl;
    }

    await party.updateOne(updatePartyDto, { new: true }).exec();

    return this.partyModel.findById(id);
  }

  // Eliminar un partido por su ID
  async remove(id: string): Promise<Party> {
    // Busca el partido por su ID
    const party = await this.partyModel.findById(id).exec();
    if (!party) {
      throw new NotFoundException(`Party with ID ${id} not found`);
    }

    party.status = !party.status;
    return party.save();
  }

  // Función para verificar si el partido existe
  private async partyExists(
    name_party: string,
    sigla_party: string,
  ): Promise<boolean> {
    const existingParty = await this.partyModel.findOne({
      $or: [{ name_party }, { sigla_party }],
    });

    return !!existingParty;
  }

  // Función auxiliar para extraer el public_id de la URL de Cloudinary
  private extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const filenameWithExtension = parts[parts.length - 1];
    return filenameWithExtension.split('.')[0];
  }
}
