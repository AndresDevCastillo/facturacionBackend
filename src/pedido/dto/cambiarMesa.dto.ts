import { IsNotEmpty, IsNumber } from 'class-validator';

export class CambiarMesaDto {
  @IsNotEmpty()
  @IsNumber()
  readonly mesaOld: number;

  @IsNotEmpty()
  @IsNumber()
  readonly mesaNew: number;

  @IsNotEmpty()
  @IsNumber()
  readonly ticket: number; //Id ticket en pedido
}
