import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateTipoCargoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El cargo no puede estar vacío' })
  readonly cargo: string;
}

export class UpdateTipoCargoDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El cargo no puede estar vacío' })
  readonly cargo: string;
}
