import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { DetalleTicket } from './entities/detalle-ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, DetalleTicket])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [TypeOrmModule],
})
export class PedidoModule {}
