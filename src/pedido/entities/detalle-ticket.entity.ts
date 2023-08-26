import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class DetalleTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalleTicket)
  pedido: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.detalleTicket)
  producto: Producto;

  @Column()
  cantidad: number;

  @Column()
  precio_unitario: number;
}
