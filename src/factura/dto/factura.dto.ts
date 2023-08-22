import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';

export class FacturaDto {
  @IsNumber()
  @IsNotEmpty()
  cedula_cliente: Cliente;

  @IsNumber()
  @IsNotEmpty()
  cedula_empleado: Empleado;

  @IsNumber()
  @IsNotEmpty()
  id_mesa: Mesa;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El  medio de pagono puede estar vacío' })
  medio_pago: string;

  @IsNumber()
  @IsNotEmpty()
  descuento: number;
}
