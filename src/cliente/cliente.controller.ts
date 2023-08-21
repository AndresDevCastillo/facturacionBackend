import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteDto } from './dto/cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('/crear')
  create(@Body() createClienteDto: ClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @Get('/:cedula')
  findOne(@Param('cedula', ParseIntPipe) cedula: number) {
    return this.clienteService.findOne(cedula);
  }

  @Put('actualizar')
  update( @Body() updateClienteDto: ClienteDto) {
    return this.clienteService.update(updateClienteDto);
  }

  @Delete('/:cedula')
  remove(@Param('cedula', ParseIntPipe) cedula: number) {
    return this.clienteService.remove(cedula);
  }
}
