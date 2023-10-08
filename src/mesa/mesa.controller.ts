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
  async create(@Body() createMesaDto: CreateMesaDto) {
    return await this.mesaService.create(createMesaDto);
  }
  @Post('/crear/:numero')
  async createMesas(@Param('numero', ParseIntPipe) numero: number){
    return await this.mesaService.createMany(numero);
  }

  @Get()
  async findAll() {
    return await this.mesaService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.mesaService.findOne(id);
  }

  @Put('/actualizar')
  async update(@Body() updateMesaDto: UpdateMesaDto) {
    return await this.mesaService.update(updateMesaDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.mesaService.remove(id);
  }
}
