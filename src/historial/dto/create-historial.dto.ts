import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHistorialDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  readonly razon: string;
}
