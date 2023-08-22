import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class ClienteDto {
  @IsNotEmpty()
  @IsNumber()
  cedula: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'el nombre no puede estar vacío' })
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'el telefono no puede estar vacío' })
  telefono: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'el correo no puede estar vacío' })
  correo: string;
}
