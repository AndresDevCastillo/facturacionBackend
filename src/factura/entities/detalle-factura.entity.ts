import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Factura } from './factura.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  facturaToProductos: number;

  @ManyToOne(() => Factura, (factura) => factura.detalleFactura, {
    
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  factura: Factura;

  @ManyToOne(() => Producto, (producto) => producto.detalleFactura, {
    cascade: true,
    eager: true
    
  })
  @JoinTable()
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

}
