import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoCargoDto {

    @IsString()
    @IsNotEmpty()
    readonly cargo: string;

}
