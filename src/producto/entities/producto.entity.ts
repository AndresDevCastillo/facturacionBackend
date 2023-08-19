import { Categoria } from "src/categoria/entities/categoria.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type: 'varchar', length: 60})
    nombre: string;

    @Column({type: 'text'})
    descripcion: string;

    @Column({type: 'boolean', default: true})
    estado: boolean;

    @ManyToOne(()=> Categoria, (categoria)=> categoria.producto)
    categoria: Categoria;
}
