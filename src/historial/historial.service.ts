import { Injectable } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Historial } from './entities/historial.entity';
import { Repository } from 'typeorm';
import { DetalleHistorial } from './entities/detalle-historial.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private historialRepository: Repository<Historial>,
    @InjectRepository(DetalleHistorial)
    private detalleHistorialRepository: Repository<DetalleHistorial>,
  ) {}
  async create(dataFactura: any, razon: string) {
    try {
      const detalleHistorial: [] = dataFactura.detalleFactura.map((detalle) => {
        return {
          producto: detalle.producto.nombre,
          cantidad: detalle.cantidad,
        };
      });
      const fecha = this.fechaAndHora();
      const dataHistorial = {
        codigo: dataFactura.codigo,
        cliente: dataFactura.cliente.nombre,
        cedula_cliente: dataFactura.cliente.cedula,
        empleado: dataFactura.empleado.nombre,
        cedula_empleado: dataFactura.empleado.cedula,
        cargo_empleado: dataFactura.empleado.tipoCargo,
        mesa: dataFactura.mesa.nombre,
        medio_pago: dataFactura.medio_pago,
        descuento: dataFactura.descuento,
        neto: dataFactura.neto,
        propina: dataFactura.propina,
        lugar: dataFactura.lugar,
        detalleHistorial: detalleHistorial,
        fecha_factura: dataFactura.fecha,
        hora_factura: dataFactura.hora,
        fecha_historial: fecha[0],
        hora_historial: fecha[1],
        razon: razon,
      };

      return await this.historialRepository
        .insert(dataHistorial)
        .then(async (historial) => {
          const detalleHistorialIns = detalleHistorial.map((detalle: any) => {
            return {
              historial: historial.raw.insertId,
              producto: detalle.producto,
              cantidad: detalle.cantidad,
            };
          });
          await this.detalleHistorialRepository.insert(detalleHistorialIns);
          return true;
        })
        .catch(() => {
          return false;
        });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  findAll() {
    return `This action returns all historial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historial`;
  }

  update(id: number, updateHistorialDto: UpdateHistorialDto) {
    return `This action updates a #${id} historial`;
  }

  remove(id: number) {
    return `This action removes a #${id} historial`;
  }

  private fechaAndHora() {
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2); // Obtiene los últimos dos dígitos del año
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // El mes se indexa desde 0, por lo que agregamos 1
    const day = fecha.getDate().toString().padStart(2, '0');

    const fechaFormateada = `${year}-${month}-${day}`;
    const hora = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getMilliseconds()}`;
    return [fechaFormateada, hora];
  }
}
