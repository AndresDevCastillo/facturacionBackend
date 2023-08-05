import { TipoCargo } from "src/tipo-cargo/entities/tipo-cargo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Empleado {
    @PrimaryColumn()
    cedula: number;

    @ManyToOne(() => TipoCargo, (tipoCargo) => tipoCargo.empleado)
    tipo_cargo: TipoCargo;

    @Column({ length: 65 })
    nombre: string;

    @Column({ length: 15 })
    telefono: string;

    @Column({ length: 60 })
    direccion: string;
}
