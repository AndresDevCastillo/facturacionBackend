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
import { CreatePedidoDto } from './dto/pedido.dto';
import { CambiarMesaDto } from './dto/cambiarMesa.dto';
import { CalificacionDto } from './dto/calificacion.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post('/crear')
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidoService.create(createPedidoDto);
  }

  @Post('/cambiarMesa')
  async cambiarMesa(@Body() cambiarMesaDto: CambiarMesaDto) {
    return await this.pedidoService.cambiarMesa(cambiarMesaDto);
  }

  @Put('/listo/:ticket')
  async cambiarPedidoListo(@Param('ticket', ParseIntPipe) ticket: number) {
    return await this.pedidoService.cambiarPedidoListo(ticket);
  }

  @Put('calificar/:id')
  async calificarPedido(
    @Body() calificacion: CalificacionDto,
    @Param('id', ParseIntPipe) idPedido: number,
  ) {
    return await this.pedidoService.calificarPedido(idPedido, calificacion);
  }

  @Get('/mesas')
  async getMesasConPedidos() {
    return await this.pedidoService.getMesasConPedidos();
  }

  @Get('/cocinero')
  async findCocinero() {
    return await this.pedidoService.findCocinero();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.pedidoService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.pedidoService.findAll();
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.pedidoService.remove(id);
  }
}
