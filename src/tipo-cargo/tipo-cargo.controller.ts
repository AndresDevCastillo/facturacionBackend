import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { TipoCargoService } from './tipo-cargo.service';
import { CreateTipoCargoDto, UpdateTipoCargoDto } from './dto/tipo-cargo.dto';

@Controller('tipo-cargo')
export class TipoCargoController {
  constructor(private readonly tipoCargoService: TipoCargoService) {}

  @Post('/crear')
  async create(@Body() createTipoCargoDto: CreateTipoCargoDto) {
    return await this.tipoCargoService.create(createTipoCargoDto);
  }

  @Get()
  async findAll() {
    return await this.tipoCargoService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tipoCargoService.findOne(id);
  }

  @Put()
  async update(@Body() updateTipoCargoDto: UpdateTipoCargoDto) {
    return await this.tipoCargoService.update(updateTipoCargoDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.tipoCargoService.remove(id);
  }
}
