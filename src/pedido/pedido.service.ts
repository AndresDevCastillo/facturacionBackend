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
      return await this.pedidoRepository
        .insert(createPedidoDto)
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
          empleado: true,
          mesa: true,
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
      await this.detallePedidoRepository.delete({
        pedido: { ticket: id_pedido },
      });
      await this.pedidoRepository.delete({ ticket: id_pedido });
      return {
        msg: 'Registros eliminados, detalle de pedido y el pedido',
        data: null,
      };
    } catch (error) {
      return {
        msg: 'Error elimando el detalle de pedido y el pedido',
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
}
