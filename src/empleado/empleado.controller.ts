import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { empleadoDto } from './dto/empleado.dto';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) { }

  @Post('/crear')
  create(@Body() createEmpleadoDto: empleadoDto) {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  findAll() {
    return this.empleadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadoService.findOne(+id);
  }

  @Put('/actualizar')
  update(@Body() updateEmpleadoDto: empleadoDto) {
    return this.empleadoService.update(updateEmpleadoDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.remove(id);
  }
}
