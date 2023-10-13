import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, Usuario])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [TypeOrmModule],
})
export class EmpleadoModule {}
