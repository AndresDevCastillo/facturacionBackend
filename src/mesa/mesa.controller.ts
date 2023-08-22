import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto, UpdateMesaDto } from './dto/mesa.dto';

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post('/crear')
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.create(createMesaDto);
  }

  @Get()
  findAll() {
    return this.mesaService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mesaService.findOne(id);
  }

  @Put('/actualizar')
  update(@Body() updateMesaDto: UpdateMesaDto) {
    return this.mesaService.update(updateMesaDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mesaService.remove(id);
  }
}
