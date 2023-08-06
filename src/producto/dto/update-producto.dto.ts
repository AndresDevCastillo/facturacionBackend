import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {

    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}
