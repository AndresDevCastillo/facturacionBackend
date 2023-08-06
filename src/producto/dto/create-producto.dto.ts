import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Categoria } from "src/categoria/entities/categoria.entity";

export class CreateProductoDto {

    @IsNumber()
    @IsNotEmpty()
    readonly categoria: Categoria;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly precio: number;

    @IsBoolean()
    @IsNotEmpty()
    readonly estado: boolean;
}
