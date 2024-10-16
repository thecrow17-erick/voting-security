import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Length,
  IsUrl,
} from 'class-validator';

export class CreatePartyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name_party: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  sigla_party: string;

  @IsOptional() // Se vuelve opcional porque se llenará después
  @IsString()
  @IsUrl()
  logo_party: string;

  @IsString()
  @IsOptional()
  description_party?: string;

  @IsBoolean()
  @IsOptional()
  readonly status?: boolean;
}
