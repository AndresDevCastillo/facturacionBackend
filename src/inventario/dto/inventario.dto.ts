import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Producto } from 'src/producto/entities/producto.entity';

export class CreateInventarioDto {
  @IsNotEmpty()
  @IsBoolean()
  estado: true;

  @IsNotEmpty()
  @IsNumber()
  producto: Producto;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  existencia: number;
}

export class updateInventarioDto extends CreateInventarioDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
