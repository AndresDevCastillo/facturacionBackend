import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { DetalleFactura } from './entities/detalle-factura.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { FacturaRepositoryService } from './entities/factura.repository';
import { Gasto } from 'src/gasto/entities/gasto.entity';
import { GastoRepositoryService } from 'src/gasto/entities/gasto.repository';
import { HistorialModule } from 'src/historial/historial.module';
import { HistorialService } from 'src/historial/historial.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura,
      DetalleFactura,
      Pedido,
      Producto,
      Gasto,
    ]),
    HistorialModule
  ],
  controllers: [FacturaController],
  providers: [FacturaService, FacturaRepositoryService, GastoRepositoryService, HistorialService],
  exports: [TypeOrmModule],
})
export class FacturaModule {}
