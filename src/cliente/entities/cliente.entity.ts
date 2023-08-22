import { Factura } from 'src/factura/entities/factura.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column({ type: 'varchar', length: 65 })
  nombre: string;

  @Column({ type: 'varchar', length: 15 })
  telefono: string;

  @Column({ type: 'varchar', length: 65 })
  correo: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToMany(() => Factura, (factura) => factura.cliente)
  factura: Factura[];
}
