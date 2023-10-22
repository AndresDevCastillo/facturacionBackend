import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleHistorial } from './detalle-historial.entity';

@Entity()
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'varchar', length: 90 })
  cliente: string;

  @Column()
  cedula_cliente: number;

  @Column({ type: 'varchar', length: 90 })
  empleado: string;

  @Column()
  cedula_empleado: number;

  @Column({ type: 'varchar', length: 50 })
  cargo_empleado: string;

  @Column({ type: 'varchar', length: 50 })
  mesa: string;

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

  @OneToMany(
    () => DetalleHistorial,
    (detalleHistorial) => detalleHistorial.historial,
    {
      eager: true,
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  @JoinTable()
  detalleHistorial: DetalleHistorial[];

  @Column({ type: 'date' }) // Columna para la fecha de la factura
  fecha_factura: Date;

  @Column({ type: 'time' }) // Columna para la hora de la factura
  hora_factura: string;

  @Column({ type: 'date' })
  fecha_historial: Date;

  @Column({ type: 'time' })
  hora_historial: Date;

  @Column({ type: 'text' })
  razon: string; //Descripción de porque se borro la factura
}
