import { empleadoDto } from "src/empleado/dto/empleado.dto";
import { Empleado } from "src/empleado/entities/empleado.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoCargo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 40 })
    cargo: string;

    @OneToMany(() => Empleado, (empleado) => empleado.tipo_cargo)
    empleado: Empleado[]
}
