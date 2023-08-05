import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TipoCargoService } from './tipo-cargo.service';
import { CreateTipoCargoDto } from './dto/create-tipo-cargo.dto';
import { UpdateTipoCargoDto } from './dto/update-tipo-cargo.dto';

@Controller('tipo-cargo')
export class TipoCargoController {
  constructor(private readonly tipoCargoService: TipoCargoService) { }

  @Post('/crear')
  create(@Body() createTipoCargoDto: CreateTipoCargoDto) {
    return this.tipoCargoService.create(createTipoCargoDto);
  }

  @Get()
  findAll() {
    return this.tipoCargoService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.tipoCargoService.findOne(+id);
  }

  @Put('actualizar')
  update(@Body() updateTipoCargoDto: UpdateTipoCargoDto) {
    return this.tipoCargoService.update(updateTipoCargoDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.tipoCargoService.delete(+id);
  }
}
