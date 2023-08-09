import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCargoModule } from './tipo-cargo/tipo-cargo.module';
import { TipoCargo } from './tipo-cargo/entities/tipo-cargo.entity';
import { EmpleadoModule } from './empleado/empleado.module';
import { Empleado } from './empleado/entities/empleado.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { Categoria } from './categoria/entities/categoria.entity';
import { ProductoModule } from './producto/producto.module';
import { Producto } from './producto/entities/producto.entity';
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
      entities: [TipoCargo, Empleado, Categoria, Producto],
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    TipoCargoModule,
    EmpleadoModule,
    CategoriaModule,
    ProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
