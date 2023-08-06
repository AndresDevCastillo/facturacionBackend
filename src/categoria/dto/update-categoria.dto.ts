import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {

    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}
