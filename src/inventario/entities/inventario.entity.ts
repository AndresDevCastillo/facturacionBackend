import { Producto } from 'src/producto/entities/producto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToOne(() => Producto)
  @JoinColumn()
  producto: Producto;

  @Column()
  cantidad: number;

  @Column()
  existencia: number;
}
