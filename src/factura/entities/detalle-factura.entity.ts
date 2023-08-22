import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Factura } from './factura.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  facturaToProductos: number;

  @ManyToOne(() => Factura, (factura) => factura.detalleFactura)
  factura: Factura;

  @ManyToOne(() => Producto, (producto) => producto.detalleFactura)
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'int' })
  precio_unitario: number;
}
