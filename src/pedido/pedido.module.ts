import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { DetalleTicket } from './entities/detalle-ticket.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { InventarioModule } from 'src/inventario/inventario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, DetalleTicket, Inventario, Producto])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [TypeOrmModule, PedidoService],
})
export class PedidoModule {}
