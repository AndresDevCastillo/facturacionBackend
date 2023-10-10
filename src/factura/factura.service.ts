import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { In, Repository } from 'typeorm';
import { DetalleFactura } from './entities/detalle-factura.entity';
import { FacturaDto } from './dto/factura.dto';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { FacturaRepositoryService } from './entities/factura.repository';

@Injectable()
export class FacturaService {
  constructor(
    private readonly facturaCustomRepository: FacturaRepositoryService,
    @InjectRepository(Factura) private facturaRepository: Repository<Factura>,
    @InjectRepository(DetalleFactura)
    private detalleFacturaRepository: Repository<DetalleFactura>,
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
  ) {}
  async findAll() {
    return await this.facturaRepository.find({
      relations: {
        detalleFactura: true,
        empleado: true,
        cliente: true,
        mesa: true,
      },
    });
  }

  async create(createFacturaDto: FacturaDto, idPedido: number) {
    const colombiaTimezone = 'America/Bogota';
    const now = new Date();

    const { DateTime } = require('luxon');
    const colombiaDateTime = DateTime.fromJSDate(now, {
      zone: colombiaTimezone,
    });

    const fecha = colombiaDateTime.toJSDate();
    const hora = colombiaDateTime.toFormat('HH:mm:ss');
    const newFactura = {
      ...createFacturaDto,
      fecha,
      hora,
    };
    try {
      return await this.facturaRepository
        .insert(newFactura)
        .then(async (resp) => {
          let codigo = resp.identifiers[0].codigo;
          let detalleFactura = createFacturaDto.detalleFactura;
          detalleFactura = detalleFactura.map((obj: any) => {
            obj.factura = codigo;
            return obj;
          });

          await this.pedidoRepository.delete(idPedido);
          return await this.detalleFacturaRepository
            .insert(detalleFactura)
            .then(async () => {
              return await this.facturaRepository
                .find({
                  where: { codigo: codigo },
                  relations: {
                    detalleFactura: true,
                    empleado: true,
                    cliente: true,
                    mesa: true,
                  },
                })
                .then((data: any) => {
                  if (data[0].codigo < 1000 && data[0].codigo >= 100) {
                    data[0].codigo = '0' + data[0].codigo;
                  }
                  if (data[0].codigo < 100 && data[0].codigo >= 10) {
                    data[0].codigo = '00' + data[0].codigo;
                  }
                  if (data[0].codigo < 10 && data[0].codigo >= 0) {
                    data[0].codigo = '000' + data[0].codigo;
                  }
                  return data[0];
                });
            })
            .catch(async (error: any) => {
              return {
                msg: 'ocurrio un error al ingresar los productos',
                error: error,
                reverse: await this.remove(codigo),
              };
            });
        });
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.facturaRepository
        .find({
          where: { codigo: id },
          relations: {
            detalleFactura: true,
            empleado: true,
            cliente: true,
            mesa: true,
          },
        })
        .then((data: any) => {
          if (data.length > 0) {
            if (data[0].codigo < 1000 && data[0].codigo >= 100) {
              data[0].codigo = '0' + data[0].codigo;
            }
            if (data[0].codigo < 100 && data[0].codigo >= 10) {
              data[0].codigo = '00' + data[0].codigo;
            }
            if (data[0].codigo < 10 && data[0].codigo >= 0) {
              data[0].codigo = '000' + data[0].codigo;
            }
            return data[0];
          }
          return new NotFoundException(`No se encontro el id: ${id}`);
        });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(id: number) {
    try {
      const existe = await this.checkIfExists(id);
      if (existe) {
        return await this.facturaRepository.delete(id);
      }
      return new NotFoundException(`No se enontro el id: ${id}`);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async estadisticasYear(year: number) {
    try {
      const facturaByYear =
        await this.facturaCustomRepository.getEstadisticasYearProducto(year);
      return await this.calcularVentas(facturaByYear);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }
  async estadisticasMes(year: number, mes: number) {
    try {
      const facturaByYear =
        await this.facturaCustomRepository.getEstadisticasYearAndMonthProducto(
          year,
          mes,
        );
      return await this.calcularVentas(facturaByYear);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }
  async estadisticasDia(year: number, mes: number, dia: number) {
    try {
      const facturaByYear =
        await this.facturaCustomRepository.getEstadisticasYearMonthAndDayProducto(
          year,
          mes,
          dia,
        );
      return await this.calcularVentas(facturaByYear);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  private async checkIfExists(id: number) {
    try {
      return await this.facturaRepository
        .findBy({ codigo: id })
        .then((resp) => {
          if (resp.length > 0) {
            return true;
          }
          return false;
        });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  private async calcularVentas(factura: any[]) {
    const codigosFactura = factura.map((factura) => {
      return factura.codigo;
    });
    const productosByYear = await this.detalleFacturaRepository.findBy({
      factura: In(codigosFactura),
      producto: {
        estado: true,
      },
    });
    let grafica = [];
    productosByYear.map((informacion) => {
      let existeProducto: number | boolean = true;
      grafica.map((producto, index) => {
        if (producto.nombre === informacion.producto.nombre) {
          existeProducto = index;
          return;
        }
      });
      if (existeProducto != true) {
        grafica[existeProducto].cantidad += informacion.cantidad;
      } else {
        grafica.push({
          nombre: informacion.producto.nombre,
          cantidad: informacion.cantidad,
        });
      }
    });
    return grafica;
  }

  private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}
