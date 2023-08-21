import { Module } from '@nestjs/common';
import { TipoCargoService } from './tipo-cargo.service';
import { TipoCargoController } from './tipo-cargo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCargo } from './entities/tipo-cargo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCargo])],
  controllers: [TipoCargoController],
  providers: [TipoCargoService],
  exports: [TypeOrmModule, TipoCargoService],
})
export class TipoCargoModule {}