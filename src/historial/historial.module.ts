import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historial } from './entities/historial.entity';
import { DetalleHistorial } from './entities/detalle-historial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Historial, DetalleHistorial])],
  controllers: [HistorialController],
  providers: [HistorialService],
  exports: [TypeOrmModule, HistorialService],
})
export class HistorialModule {}
