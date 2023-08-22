import { Injectable } from '@nestjs/common';
import { FacturaDto } from './dto/factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';
import { DetalleFactura } from './entities/detalle-factura.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura) private facturaRepository: Repository<Factura>,
    @InjectRepository(DetalleFactura)
    private detalleFacturaRepository: Repository<DetalleFactura>,
  ) {}
  async create(createFacturaDto) {
    try {
      return await this.facturaRepository
        .insert(createFacturaDto)
        .then((resp) => {
          let codigo = resp.identifiers[0].codigo;
          let detalleFactura = createFacturaDto.detalleFactura;
          detalleFactura = detalleFactura.map((obj) => {
            obj.factura = codigo;
            return obj;
          });
          return this.detalleFacturaRepository.insert(detalleFactura);
        });
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.facturaRepository.find({
      relations: { detalleFactura: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} factura`;
  }

  update(id: number, updateFacturaDto: FacturaDto) {
    return `This action updates a #${id} factura`;
  }

  remove(id: number) {
    return `This action removes a #${id} factura`;
  }
}
