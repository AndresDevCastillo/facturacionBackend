import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { inventarioCustomRepository } from './entities/inventario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario, Producto])],
  controllers: [InventarioController],
  providers: [InventarioService, inventarioCustomRepository],
  exports: [TypeOrmModule, inventarioCustomRepository],
})
export class InventarioModule {}
