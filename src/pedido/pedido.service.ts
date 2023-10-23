import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto, UpdatePedidoDto } from './dto/pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { In, Repository } from 'typeorm';
import { DetalleTicket } from './entities/detalle-ticket.entity';
import { CambiarMesaDto } from './dto/cambiarMesa.dto';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import { CalificacionDto } from './dto/calificacion.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetalleTicket)
    private detallePedidoRepository: Repository<DetalleTicket>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) {}
  async create(createPedidoDto: CreatePedidoDto) {
    try {
      let noHayStock: any = false;
      const productoInventario = createPedidoDto.detallePedido.map((pedido) => {
        return pedido.idInventario;
      });
      const inventarioProductos = await this.inventarioRepository.find({
        where: {
          id: In(productoInventario),
        },
        relations: {
          producto: true,
        },
      });
      
      inventarioProductos.map((inventario) => {
        createPedidoDto.detallePedido.map((pedido, indexPedido) => {
          if (
            inventario.id == pedido.idInventario &&
            pedido.cantidad > inventario.existencia
          ) {
            noHayStock = {
              noHayStock: `No hay ${inventario.producto.nombre} - Existencia: ${inventario.existencia}`,
              indice: indexPedido,
            };
          }
        });

      });
      const productosActualizarStonck =  createPedidoDto.detallePedido.map(pedido => {
        return {
          idInventario: pedido.idInventario,
          cantidad: pedido.cantidad
        }
      });
      if (noHayStock) {
        return noHayStock;
      }
      await this.disminuirCantidadStonck(productosActualizarStonck);
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
              comentario: detalle.comentario,
              idInventario: detalle.idInventario,
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

  async calificarPedido(idPedido: number, calificacion: CalificacionDto) {
    try {
      const pedido = await this.pedidoRepository.findOneBy({ticket: idPedido});
      if(pedido) {
        pedido.calificacion = calificacion.calificacion;
        pedido.sugerencia = calificacion.sugerencia;
        return await this.pedidoRepository.save(pedido);
      }
    } catch(error) {
      this.handleBDerrors(error);
    }
  }

  async remove(id_pedido: number) {
    try {
      const pedido: any = await this.pedidoRepository.find({where: {ticket: id_pedido}, relations: {
        detalleTicket: true
      }}).then(resp => {
        return resp[0]
      });
      const eliminarProductos = pedido.detalleTicket.map(producto => {
        return {
          cantidad: producto.cantidad,
          idInventario : producto.idInventario
        }
      })
      await this.aumentarCantidadStonck(eliminarProductos);
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

  async cambiarMesa(cambiarMesaDto: CambiarMesaDto) {
    return await this.pedidoRepository.update(
      {
        ticket: cambiarMesaDto.ticket,
      },
      { mesa: { id: cambiarMesaDto.mesaNew } },
    );
  }

  async disminuirCantidadStonck(productos: any) {
    try {
      for (let i = 0; i < productos.length; i++) {
        const producto = await this.inventarioRepository.findOneBy({id: productos[i].idInventario});
        producto.existencia = producto.existencia - productos[i].cantidad;
        await this.inventarioRepository.save(producto);
      }
    } catch (error) {
      this.handleBDerrors(error);
    }
  }
  async aumentarCantidadStonck(productos: any) {
    try {
      for (let i = 0; i < productos.length; i++) {
        const producto = await this.inventarioRepository.findOneBy({id: productos[i].idInventario});
        if(producto){
        producto.existencia = producto.existencia + productos[i].cantidad;
        await this.inventarioRepository.save(producto);
        }
      }
    } catch (error) {
      this.handleBDerrors(error);
    }
  }
  private formatearFechaYYMMDD(fechaS) {
    const fecha = new Date(fechaS);
    const year = fecha.getFullYear().toString().slice(-2); // Obtiene los últimos dos dígitos del año
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // El mes se indexa desde 0, por lo que agregamos 1
    const day = fecha.getDate().toString().padStart(2, '0');

    const fechaFormateada = `${year}-${month}-${day}`;

    return fechaFormateada;
  }
  private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}
