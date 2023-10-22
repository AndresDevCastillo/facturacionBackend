import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleTicket } from './detalle-ticket.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  ticket: number;

  @ManyToOne(() => Mesa, (mesa) => mesa.pedido)
  mesa: Mesa;

  @ManyToOne(() => Empleado, (empleado) => empleado.pedido)
  empleado: Empleado;

  @OneToMany(() => DetalleTicket, (detalleTicket) => detalleTicket.pedido)
  @JoinTable()
  detalleTicket: DetalleTicket[];

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' }) // Columna para la hora
  hora: string;

}
