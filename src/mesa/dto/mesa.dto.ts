import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  nombre: string;
}

export class UpdateMesaDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  nombre: string;
}
