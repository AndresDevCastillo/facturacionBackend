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
import { PedidoService } from './pedido.service';
import { CreatePedidoDto, UpdatePedidoDto } from './dto/pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post('/crear')
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidoService.create(createPedidoDto);
  }

  @Get()
  async findAll() {
    return await this.pedidoService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.pedidoService.findOne(id);
  }

  @Put()
  async update(@Body() updatePedidoDto: UpdatePedidoDto) {
    return await this.pedidoService.update(updatePedidoDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.pedidoService.remove(id);
  }
}
