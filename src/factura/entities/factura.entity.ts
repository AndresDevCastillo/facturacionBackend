import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetalleFactura } from './detalle-factura.entity';
import { IsDate } from 'class-validator';

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

  @Column({ type: 'integer'})
  total: number;

  @Column({type: 'integer'})
  propina: number;

  @Column({type: 'varchar'})
  lugar: string;

  @OneToMany(() => DetalleFactura, (detalleFactura) => detalleFactura.factura ,  {
  eager: true,
  })
  @JoinTable()
  detalleFactura: DetalleFactura[];

  @Column({ type: 'date' }) // Columna para la fecha
  @IsDate()
  fecha: Date;

  @Column({ type: 'time' }) // Columna para la hora
  hora: string;

  @BeforeInsert()
  async setFechaYHora() {
    console.log('LLego a setFechaYHora')
    const colombiaTimezone = 'America/Bogota';
    const now = new Date();

    const { DateTime } = require('luxon');
    const colombiaDateTime = DateTime.fromJSDate(now, { zone: colombiaTimezone });

    this.fecha = colombiaDateTime.toJSDate();
    this.hora = colombiaDateTime.toFormat('HH:mm:ss');
  }
}
