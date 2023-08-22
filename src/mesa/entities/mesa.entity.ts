import { Factura } from 'src/factura/entities/factura.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 65 })
  nombre: string;

  @Column({ type: 'boolean', default: true, select: false })
  estado: boolean;

  @OneToMany(() => Factura, (factura) => factura.mesa)
  factura: Factura[];
}
