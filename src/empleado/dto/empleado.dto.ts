import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TipoCargo } from "src/tipo-cargo/entities/tipo-cargo.entity";


export class empleadoDto {

    @IsNumber()
    @IsNotEmpty()
    readonly cedula: number;

    @IsNumber()
    @IsNotEmpty()
    readonly tipo_cargo: TipoCargo;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly telefono: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;


}