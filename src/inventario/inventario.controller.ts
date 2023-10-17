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
import { InventarioService } from './inventario.service';
import { CreateInventarioDto, updateInventarioDto } from './dto/inventario.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('crear')
  async create(@Body() createInventarioDto: CreateInventarioDto) {
    return await this.inventarioService.create(createInventarioDto);
  }

  @Get()
  async findAll() {
    return await this.inventarioService.findAll();
  }
  @Get('/productos')
  async findProductos(){
    return await this.inventarioService.productosSinInvetario();
  }
  @Put('/actualizar')
  async update(@Body() inventario: updateInventarioDto) {
    return await this.update(inventario);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.inventarioService.remove(id);
  }
}
