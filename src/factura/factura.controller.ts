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
  async findAll() {
    return await this.facturaService.findAll();
  }
  @Get('Estadisticas/year/:year')
  async estadisticasYear(@Param('year') year: number) {
    return await this.facturaService.estadisticasYear(year);
  }

  @Post('/crear/:pedido')
  async create(@Body() createFacturaDto: FacturaDto, @Param('pedido', ParseIntPipe) idPedido: number) {
    return await this.facturaService.create(createFacturaDto, idPedido);
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
     return await this.facturaService.findOne(id);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
     return await this.facturaService.remove(id);
  }

}
