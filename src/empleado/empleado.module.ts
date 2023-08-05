import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { TipoCargo } from 'src/tipo-cargo/entities/tipo-cargo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, TipoCargo])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [TypeOrmModule]
})
export class EmpleadoModule { }
