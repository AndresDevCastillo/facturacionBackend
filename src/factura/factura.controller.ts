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
 

  // ESTADISTICAS DE PRODUCTOS

  @Get('estadisticas/year/:year')
  async estadisticasYear(@Param('year', ParseIntPipe) year: number) {
    return await this.facturaService.estadisticasYear(year);
  }
  @Get('estadisticas/mes/:year/:mes')
  async estadisticasMes(
    @Param('year', ParseIntPipe) year: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    return await this.facturaService.estadisticasMes(year, mes);
  }
  @Get('estadisticas/dia/:year/:mes/:dia')
  async estadisticasDia(
    @Param('year', ParseIntPipe) year: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Param('dia', ParseIntPipe) dia: number,
  ) {
    return await this.facturaService.estadisticasDia(year, mes, dia);
  }

  // ESTADISTICAS DE GANANCIAS
  @Get('ganancias/year/:year')
  async gananciasYear(@Param('year', ParseIntPipe) year: number) {
    return await this.facturaService.gananciasYear(year);
  }

  @Get('/ganancias/mes/:year/:mes')
  async gananciasMes(
    @Param('year', ParseIntPipe) year: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    return await this.facturaService.gananciasMes(year, mes);
  }
  @Get('/ganancias/dia/:year/:mes/:dia')
  async gananciasDia(
    @Param('year', ParseIntPipe) year: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Param('dia', ParseIntPipe) dia: number,
  ) {
    return await this.facturaService.gananciasDia(year, mes, dia);
  }

  @Post('/crear/:pedido')
  async create(
    @Body() createFacturaDto: FacturaDto,
    @Param('pedido', ParseIntPipe) idPedido: number,
  ) {
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
