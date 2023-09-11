import { IsNotEmpty, IsNumber } from 'class-validator';
import { Pedido } from '../entities/pedido.entity';
import { Producto } from 'src/producto/entities/producto.entity';

export class DetalleTicketDto {
  @IsNotEmpty()
  readonly pedido: Pedido; //Id ticket

  @IsNotEmpty()
  readonly producto: Producto;

  @IsNotEmpty()
  @IsNumber()
  readonly cantidad: number;

}
