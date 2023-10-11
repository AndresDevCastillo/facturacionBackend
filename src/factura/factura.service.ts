import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { In, Repository } from 'typeorm';
import { DetalleFactura } from './entities/detalle-factura.entity';
import { FacturaDto } from './dto/factura.dto';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { FacturaRepositoryService } from './entities/factura.repository';
import { GastoRepositoryService } from 'src/gasto/entities/gasto.repository';

@Injectable()
export class FacturaService {
  constructor(
    private readonly facturaCustomRepository: FacturaRepositoryService,
    private readonly GastoCustomRepository: GastoRepositoryService,
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
    

    const fecha = this.formatearFechaYYMMDD(colombiaDateTime);
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

  async gananciasYear(year: number) {
    const g: any = await this.GastoCustomRepository.getEstadisticasYear(year);
    const f: any = await this.facturaCustomRepository.getGananciaNetoYear(year);
    if (!g.gastoTotal) {
      g.gastoTotal = 0;
    }
    if (!f.gananciaNeto) {
      f.gananciaNeto = 0;
    }
    const ganancias = parseInt(f.gananciaNeto) - parseInt(g.gastoTotal);
    const resp = {
      fecha: year,
      total: ganancias,
      ganancia: parseInt(f.gananciaNeto),
      gasto: parseInt(g.gastoTotal),
    };
    return resp;
  }
  async gananciasMes(year: number, mes: number) {
    const g: any = await this.GastoCustomRepository.getEstadisticasYearAndMonth(
      year,
      mes,
    );
    const f: any = await this.facturaCustomRepository.getGananciaNetoMes(
      year,
      mes,
    );
    if (!g.gastoTotal) {
      g.gastoTotal = 0;
    }
    if (!f.gananciaNeto) {
      f.gananciaNeto = 0;
    }

    let mesL: string;

    if (mes == 1) {
      mesL = 'Enero';
    } else if (mes == 2) {
      mesL = 'Febrero';
    } else if (mes == 3) {
      mesL = 'Marzo';
    } else if (mes == 4) {
      mesL = 'Abril';
    } else if (mes == 5) {
      mesL = 'Mayo';
    } else if (mes == 6) {
      mesL = 'Junio';
    } else if (mes == 7) {
      mesL = 'Julio';
    } else if (mes == 8) {
      mesL = 'Agosto';
    } else if (mes == 9) {
      mesL = 'Septiembre';
    } else if (mes == 10) {
      mesL = 'Octubre';
    } else if (mes == 11) {
      mesL = 'Noviembre';
    } else if (mes == 12) {
      mesL = 'Diciembre';
    }
    const ganancias = parseInt(f.gananciaNeto) - parseInt(g.gastoTotal);
    const resp = {
      fecha: mesL,
      total: ganancias,
      ganancia: parseInt(f.gananciaNeto),
      gasto: parseInt(g.gastoTotal),
    };
    return resp;
  }

  async gananciasDia(year: number, month: number, day: number) {
    const f: any = await this.facturaCustomRepository.getGananciaNetoDia(
      year,
      month,
      day,
    );
    const g: any =
      await this.GastoCustomRepository.getEstadisticasYearMonthAndDay(
        year,
        month,
        day,
      );
    if (!g.gastoTotal) {
      g.gastoTotal = 0;
    }
    if (!f.gananciaNeto) {
      f.gananciaNeto = 0;
    }
    const ganancias = parseInt(f.gananciaNeto) - parseInt(g.gastoTotal);

    const fecha = new Date(year, month - 1, day);
    const diasSemana = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    const diaSemana = diasSemana[fecha.getDay()];
    const resp = {
      fecha: diaSemana,
      total: ganancias,
      ganancia: parseInt(f.gananciaNeto),
      gasto: parseInt(g.gastoTotal),
    };
    return resp;
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
  private formatearFechaYYMMDD(fechaS) {
    const fecha = new Date(fechaS);
  const year = fecha.getFullYear().toString().slice(-2); // Obtiene los últimos dos dígitos del año
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // El mes se indexa desde 0, por lo que agregamos 1
  const day = fecha.getDate().toString().padStart(2, '0');

  const fechaFormateada = `${year}-${month}-${day}`;

  return fechaFormateada;
}
}
