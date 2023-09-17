import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { DetalleTicketDto } from './detalleTicket.dto';

export class CreatePedidoDto {
  @IsNotEmpty()
  readonly mesa: Mesa;

  @IsNotEmpty()
  readonly empleado: Empleado;

  @IsArray()
  readonly detallePedido: DetalleTicketDto[];
}

export class UpdatePedidoDto {
  @IsNumber()
  @IsNotEmpty()
  readonly ticket: number;
}
