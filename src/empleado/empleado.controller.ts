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

  @Get('/cargos')
  async getCargos() {
    return await this.empleadoService.getCargos();
  }

  @Get('/cargos/empresa')
  async getCargosEmpresa() {
    return await this.empleadoService.getCargosEmpresa();
  }

  @Get('/empresa/nouser')
  async getEmpleadosSinUsuario() {
    return await this.empleadoService.getEmpleadosSinUsuario();
  }
  @Get('/empresa')
  async getEmpleadosByEmpresa() {
    return await this.empleadoService.getEmpleadosByEmpresa();
  }

  @Get('/:cedula')
  async findOne(@Param('cedula', ParseIntPipe) cedula: number) {
    return await this.empleadoService.findOne(cedula);
  }

  @Put('/actualizar')
  async update(@Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return await this.empleadoService.update(updateEmpleadoDto);
  }

  @Delete('/:cedula')
  async remove(@Param('cedula', ParseIntPipe) cedula: number) {
    return await this.empleadoService.removeEnserio(cedula);
  }
}
