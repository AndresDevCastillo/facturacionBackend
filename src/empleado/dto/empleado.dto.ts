import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateEmpleadoDto {
  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La descripcion estar vacío' })
  @MaxLength(15, {
    message: 'El número de teléfono sólo puede tener máximo 15 carácteres',
  })
  readonly telefono: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La descripcion estar vacío' })
  @MaxLength(60, {
    message: 'La dirección sólo puede tener máximo 60 carácteres',
  })
  readonly direccion: string;

  @IsNumber()
  @IsNotEmpty()
  readonly tipoCargo: string;
}

export class UpdateEmpleadoDto {


  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number; //Cédula a actualizar

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La descripcion estar vacío' })
  @MaxLength(15, {
    message: 'El número de teléfono sólo puede tener máximo 15 carácteres',
  })
  readonly telefono: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La descripcion estar vacío' })
  @MaxLength(60, {
    message: 'La dirección sólo puede tener máximo 60 carácteres',
  })
  readonly direccion: string;

  @IsNumber()
  @IsNotEmpty()
  readonly tipoCargo: string;
}
