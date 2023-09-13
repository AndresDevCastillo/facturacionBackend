import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DetalleFactura } from './entities/detalle-factura.entity';
import { FacturaDto } from './dto/factura.dto';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura) private facturaRepository: Repository<Factura>,
    @InjectRepository(DetalleFactura)
    private detalleFacturaRepository: Repository<DetalleFactura>,
  ) {}
  async create(createFacturaDto: FacturaDto) {
    try {
      return await this.facturaRepository
        .insert(createFacturaDto)
        .then(async (resp) => {
          let codigo = resp.identifiers[0].codigo;
          let detalleFactura = createFacturaDto.detalleFactura;
          detalleFactura = detalleFactura.map((obj: any) => {
            obj.factura = codigo;
            return obj;
          });

          return await this.detalleFacturaRepository
            .insert(detalleFactura)
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
          relations: { detalleFactura: true , empleado: true , cliente: true, mesa: true },
        

        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp[0];
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

  private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}
