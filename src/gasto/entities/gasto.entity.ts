import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  categoria: string;

  @Column()
  monto: number;
}
