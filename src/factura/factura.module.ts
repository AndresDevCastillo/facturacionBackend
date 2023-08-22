import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { DetalleFactura } from './entities/detalle-factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, DetalleFactura])],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [TypeOrmModule],
})
export class FacturaModule {}
