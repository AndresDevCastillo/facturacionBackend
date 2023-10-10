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

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gastoService.remove(id);
  }
}
