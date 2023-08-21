import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TipoCargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  cargo: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToMany(() => Empleado, (empleado) => empleado.tipoCargo)
  empleado: Empleado[];
}
