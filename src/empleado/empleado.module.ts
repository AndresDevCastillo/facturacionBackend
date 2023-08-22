import { Module, forwardRef } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { TipoCargoModule } from 'src/tipo-cargo/tipo-cargo.module';
import { TipoCargoService } from 'src/tipo-cargo/tipo-cargo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado]), TipoCargoModule],
  controllers: [EmpleadoController],
  providers: [EmpleadoService, TipoCargoService],
  exports: [TypeOrmModule],
})
export class EmpleadoModule {}
