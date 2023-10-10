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
import { GastoService } from './gasto.service';
import { CreateGastoDto } from './dto/gasto.dto';

@Controller('gasto')
export class GastoController {
  constructor(private readonly gastoService: GastoService) {}

  @Post('/crear')
  async create(@Body() createGastoDto: CreateGastoDto) {
    return await this.gastoService.create(createGastoDto);
  }

  @Get()
  async findAll() {
    return await this.gastoService.findAll();
  }
  @Get('/estadisticas/year/:year')
  async gastoAnual(@Param('year', ParseIntPipe) year: number) {
    return await this.gastoService.gastoAnual(year);
  }

  @Get('/estadisticas/mes/:year/:mes')
  async gastoMensual(
    @Param('year', ParseIntPipe) year: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    return await this.gastoService.gastoMensual(year, mes);
  }

  @Get('/estadisticas/dia/:year/:mes/:dia')
  async gastoDiario(
    @Param('year', ParseIntPipe) year: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Param('dia', ParseIntPipe) dia: number,
  ) {
    return await this.gastoService.gastoDiario(year, mes, dia);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gastoService.remove(id);
  }
}
