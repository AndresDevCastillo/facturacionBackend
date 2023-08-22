import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 65 })
  nombre: string;

  @Column({ type: 'boolean', default: true, select: false })
  estado: boolean;
}
