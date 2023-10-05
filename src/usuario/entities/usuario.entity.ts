import { Empleado } from 'src/empleado/entities/empleado.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 65 })
  usuario: string;

  @Column({ type: 'varchar', length: 256, select: false })
  contrasena: string;

  @OneToOne(() => Empleado)
  @JoinColumn()
  empleado: Empleado;
}
