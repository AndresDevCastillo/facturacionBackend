import { Categoria } from "src/categoria/entities/categoria.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.producto)
    categoria: Categoria;

    @Column()
    nombre: string;

    @Column({ type: 'text' })
    descripcion: string;

    @Column()
    precio: number;

    @Column()
    estado: boolean;
}
