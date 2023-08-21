import { TipoCargo } from 'src/tipo-cargo/entities/tipo-cargo.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Empleado {
  @PrimaryColumn()
  cedula: number;

  @Column({ type: 'varchar', length: 65 })
  nombre: string;

  @Column({ type: 'varchar', length: 15 })
  telefono: string;

  @Column({ type: 'varchar', length: 60 })
  direccion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ManyToOne(() => TipoCargo, (tipoCargo) => tipoCargo.empleado)
  tipoCargo: TipoCargo;
}