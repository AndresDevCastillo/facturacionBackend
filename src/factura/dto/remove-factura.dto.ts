import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFacturaDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number; //id de factura

  @IsNotEmpty()
  readonly razon: string;
}
