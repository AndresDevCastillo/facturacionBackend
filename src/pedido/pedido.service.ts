import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto, UpdatePedidoDto } from './dto/pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { DetalleTicket } from './entities/detalle-ticket.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetalleTicket)
    private detallePedidoRepository: Repository<DetalleTicket>,
  ) {}
  async create(createPedidoDto: CreatePedidoDto) {
    try {
      const colombiaTimezone = 'America/Bogota';
      const now = new Date();

      const { DateTime } = require('luxon');
      const colombiaDateTime = DateTime.fromJSDate(now, {
        zone: colombiaTimezone,
      });

      const fecha = this.formatearFechaYYMMDD(colombiaDateTime);
      const hora = colombiaDateTime.toFormat('HH:mm:ss');
      return await this.pedidoRepository
        .insert({
          ...createPedidoDto,
          fecha,
          hora,
        })
        .then(async (pedido) => {
          const detallePedido = createPedidoDto.detallePedido.map((detalle) => {
            return {
              pedido: pedido.raw.insertId,
              producto: detalle.producto,
              cantidad: detalle.cantidad,
            };
          });
          const gDetalleP = await this.detallePedidoRepository
            .insert(detallePedido)
            .then((detalles) => {
              return detalles;
            })
            .catch(async (error) => {
              return {
                msg: 'Error guardando los detalles de pedido',
                errorGuard: error,
                reverse: await this.remove(pedido.raw.insertId),
              };
            });
          return { pedido: pedido, detallePedido: gDetalleP };
        })
        .catch((error) => {
          return { msg: 'Error guardando el pedido', data: error };
        });
    } catch (error) {
      return {
        msg: 'Error tratando de guardar detalle y pedido',
        error: error,
      };
    }
  }

  async findAll() {
    try {
      return await this.pedidoRepository.find({
        relations: {
          detalleTicket: true,
          mesa: true,
          empleado: true,
        },
        order: {
          ticket: 'ASC',
        },
      });
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.pedidoRepository
        .findOne({
          where: { ticket: id },
          relations: { detalleTicket: true },
        })
        .then((pedido) => {
          return pedido != null
            ? pedido
            : new NotFoundException(`No hay pedido registrado con id: ${id}`);
        });
    } catch (error) {
      return error;
    }
  }

  async update(updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a # ${updatePedidoDto} pedido`;
  }

  async remove(id_pedido: number) {
    try {
      await this.pedidoRepository.delete({ ticket: id_pedido });
      return {
        msg: 'Registros eliminados, detalle de pedido y el pedido',
        data: null,
      };
    } catch (error) {
      return {
        msg: 'Error eliminando el detalle de pedido y el pedido',
        data: error,
      };
    }
  }
  async getMesasConPedidos() {
    return await this.pedidoRepository
      .find({ relations: { mesa: true }, select: { mesa: { id: true } } })
      .then((pedidos) => {
        return pedidos.map((pedido) => {
          return pedido.mesa.id;
        });
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
