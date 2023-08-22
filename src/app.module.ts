import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaModule } from './categoria/categoria.module';
import { Categoria } from './categoria/entities/categoria.entity';
import { ProductoModule } from './producto/producto.module';
import { ClienteModule } from './cliente/cliente.module';
import { MesaModule } from './mesa/mesa.module';
import { TipoCargoModule } from './tipo-cargo/tipo-cargo.module';
import { EmpleadoModule } from './empleado/empleado.module';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [Categoria],
      synchronize: true,
      autoLoadEntities: true,
      /*  ssl: {
        rejectUnauthorized: false,
      }, */
    }),
    CategoriaModule,
    ProductoModule,
    ClienteModule,
    MesaModule,
    TipoCargoModule,
    EmpleadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
