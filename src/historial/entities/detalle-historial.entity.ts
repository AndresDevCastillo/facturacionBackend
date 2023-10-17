import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Historial } from './historial.entity';

@Entity()
export class DetalleHistorial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Historial, (historial) => historial.detalleHistorial)
  @JoinTable()
  historial: Historial;

  @Column({ type: 'varchar', length: 80 })
  producto: string;

  @Column({ type: 'int' })
  cantidad: number;
}
