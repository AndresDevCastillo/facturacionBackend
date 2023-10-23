import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CalificacionDto {
    @IsNotEmpty()
    @IsNumber()
    calificacion: number;

    @IsNotEmpty()
    @IsString()
    sugerencia: string;
}