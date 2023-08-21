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
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './dto/empleado.dto';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post('/crear')
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return await this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  async findAll() {
    return await this.empleadoService.findAll();
  }

  @Get('/:cedula')
  async findOne(@Param('cedula', ParseIntPipe) cedula: number) {
    return await this.empleadoService.findOne(cedula);
  }

  @Put()
  async update(@Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return await this.empleadoService.update(updateEmpleadoDto);
  }

  @Delete('/:cedula')
  async remove(@Param('cedula', ParseIntPipe) cedula: number) {
    return await this.empleadoService.remove(cedula);
  }
}
