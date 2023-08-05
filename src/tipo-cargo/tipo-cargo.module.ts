import { Module } from '@nestjs/common';
import { TipoCargoService } from './tipo-cargo.service';
import { TipoCargoController } from './tipo-cargo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCargo } from './entities/tipo-cargo.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCargo])],
  controllers: [TipoCargoController],
  providers: [TipoCargoService],
  exports: [TypeOrmModule]
})
export class TipoCargoModule { }
