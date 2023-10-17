import { Module } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { MesaController } from './mesa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';
import { PedidoModule } from 'src/pedido/pedido.module';
import { PedidoService } from 'src/pedido/pedido.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa]), PedidoModule],
  controllers: [MesaController],
  providers: [MesaService, PedidoService],
  exports: [TypeOrmModule],
})
export class MesaModule {}
