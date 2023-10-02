import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { CreateDateColumn } from 'typeorm';

export class FacturaDto {
  @IsNumber()
  @IsNotEmpty()
  cliente: Cliente;

  @IsNumber()
  @IsNotEmpty()
  empleado: Empleado;

  @IsNumber()
  @IsNotEmpty()
  mesa: Mesa;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El  medio de pagono puede estar vacío' })
  medio_pago: string;

  @IsNumber()
  @IsNotEmpty()
  descuento: number;

  @CreateDateColumn()
  creacion: Date;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  neto: number;

  @IsNumber()
  @IsNotEmpty()
  propina: number;

  @IsString()
  @IsNotEmpty()
  lugar: string;

  @IsArray()
  detalleFactura: detalleFactura[];


}

export class detalleFactura {
  @IsNumber()
  @IsNotEmpty()
  producto: Producto;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

}
