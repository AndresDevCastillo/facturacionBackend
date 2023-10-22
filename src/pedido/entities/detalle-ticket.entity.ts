import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class DetalleTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalleTicket, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  pedido: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.detalleTicket, {
    eager: true,
  })
  producto: Producto;

  @Column()
  cantidad: number;

  @Column({type: 'simple-array'})
  comentario: string[];

  @Column()
  idInventario: number;
}
