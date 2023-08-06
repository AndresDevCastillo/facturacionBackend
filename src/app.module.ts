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

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'database-facturacion.czonvdkvudeb.us-east-2.rds.amazonaws.com',
    port: 3306,
    username: 'engineersoft',
    password: 'adminengineer',
    database: 'facturacion',
    entities: [TipoCargo, Empleado, Categoria, Producto],
    synchronize: true,
    autoLoadEntities: true,
    ssl: {
      "rejectUnauthorized": false
    },


  }), TipoCargoModule, EmpleadoModule, CategoriaModule, ProductoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
