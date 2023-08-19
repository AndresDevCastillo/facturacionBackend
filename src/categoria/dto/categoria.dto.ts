import { IsBoolean, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'La descripcion no puede estar vacia'})
    readonly descripcion: string;

}

export class UpdateCategoriaDto {

    @IsNumber()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'El id no puede estar vacío' })
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'La descripcion no puede estar vacia'})
    readonly descripcion: string;

}
