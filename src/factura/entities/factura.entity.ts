import { Cliente } from 'src/cliente/entities/cliente.entity';
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
import { DetalleFactura } from './detalle-factura.entity';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn()
  codigo: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.factura)
  cliente: Cliente;

  @ManyToOne(() => Empleado, (empleado) => empleado.factura)
  empleado: Empleado;

  @ManyToOne(() => Mesa, (mesa) => mesa.factura)
  mesa: Mesa;

  @Column({ type: 'varchar', length: 60 })
  medio_pago: string;

  @Column({ type: 'int' })
  descuento: number;

  @Column({ type: 'int' })
  neto: number;

  @Column({ type: 'integer' })
  total: number;

  @Column({ type: 'integer' })
  propina: number;

  @Column({ type: 'varchar' })
  lugar: string;

  @OneToMany(() => DetalleFactura, (detalleFactura) => detalleFactura.factura, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  detalleFactura: DetalleFactura[];

  @Column({ type: 'date' }) // Columna para la fecha
  fecha: Date;

  @Column({ type: 'time' }) // Columna para la hora
  hora: string;
}
