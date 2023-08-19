import { Producto } from "src/producto/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar' ,length: 60})
    nombre: string;

    @Column({type: 'text'})
    descripcion: string;

    @Column({type: 'boolean', default: true})
    estado: boolean;

    @OneToMany(()=> Producto, (producto)=> producto.categoria)
    producto: Producto;

}
