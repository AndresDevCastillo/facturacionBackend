import { Factura } from 'src/factura/entities/factura.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column({ type: 'varchar', length: 65 })
  nombre: string;

  @Column({ type: 'varchar', length: 15 })
  telefono: string;

  @Column({ type: 'varchar', length: 60 })
  direccion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'varchar', length: 60 })
  tipoCargo: string;

  @OneToMany(() => Factura, (factura) => factura.empleado)
  factura: Factura[];
  @OneToMany(() => Pedido, (Pedido) => Pedido.empleado)
  pedido: Pedido;
}
