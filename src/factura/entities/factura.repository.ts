import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Factura } from './factura.entity';

@Injectable()
export class FacturaRepositoryService extends Repository<Factura> {
  constructor(private dataSource: DataSource) {
    super(Factura, dataSource.createEntityManager());
  }

  async getEstadisticasYearProducto(year: number) {
    return await this.createQueryBuilder('factura')
      .select('factura.codigo')
      .where('YEAR(factura.fecha) = :year', { year: year })
      .getMany();
  }
  async getEstadisticasYearAndMonthProducto(year: number, month: number) {
    return await this.createQueryBuilder('factura')
      .select('factura.codigo')
      .where('YEAR(factura.fecha) = :year', { year: year })
      .andWhere('MONTH(factura.fecha) = :month', { month: month })
      .getMany();
  }
  async getEstadisticasYearMonthAndDayProducto(
    year: number,
    month: number,
    day: number,
  ) {
    return await this.createQueryBuilder('factura')
      .select('factura.codigo')
      .where('YEAR(factura.fecha) = :year', { year: year })
      .andWhere('MONTH(factura.fecha) = :month', { month: month })
      .andWhere('DAY(factura.fecha) = :day', { day: day })
      .getMany();
  }
}
