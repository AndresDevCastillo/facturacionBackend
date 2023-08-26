import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import {
  Column,
  Entity,
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

  @Column({ type: 'float' })
  descuento: number;

  @OneToMany(() => DetalleFactura, (detalleFactura) => detalleFactura.factura)
  detalleFactura: DetalleFactura[];
}
