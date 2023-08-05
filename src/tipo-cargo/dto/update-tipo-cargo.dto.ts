import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoCargoDto } from './create-tipo-cargo.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTipoCargoDto extends PartialType(CreateTipoCargoDto) {

    @IsString()
    @IsNotEmpty()
    readonly id: number;

}
