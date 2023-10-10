import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { ClienteModule } from './cliente/cliente.module';
import { MesaModule } from './mesa/mesa.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { PedidoModule } from './pedido/pedido.module';
import { FacturaModule } from './factura/factura.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { GastoModule } from './gasto/gasto.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      }, 
    }),
    CategoriaModule,
    ProductoModule,
    ClienteModule,
    MesaModule,
    EmpleadoModule,
    FacturaModule,
    PedidoModule,
    UsuarioModule,
    AuthModule,
    JwtModule,
    GastoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
