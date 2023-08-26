import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 65 })
  nombre: string;

  @Column({ type: 'boolean', default: true, select: false })
  estado: boolean;

  @OneToMany(() => Pedido, (Pedido) => Pedido.mesa)
  pedido: Pedido;
}
