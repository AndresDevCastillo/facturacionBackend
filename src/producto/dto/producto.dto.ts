import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Categoria } from 'src/categoria/entities/categoria.entity';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La descripcion estar vacío' })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  categoria: Categoria;
}

export class UpdateProductoDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La descripcion estar vacío' })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  categoria: Categoria;
}
