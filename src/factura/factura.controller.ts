import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaDto } from './dto/factura.dto';

@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Get() 
  findAll() {
    return this.facturaService.findAll();
  }
  @Post('/crear/:pedido')
  create(@Body() createFacturaDto: FacturaDto, @Param('pedido', ParseIntPipe) idPedido: number) {
    return this.facturaService.create(createFacturaDto, idPedido);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.findOne(id);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.remove(id);
  }
}
