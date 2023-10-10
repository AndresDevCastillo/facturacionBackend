import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Gasto } from './gasto.entity';

@Injectable()
export class GastoRepositoryService extends Repository<Gasto> {
  constructor(private dataSource: DataSource) {
    super(Gasto, dataSource.createEntityManager());
  }
  async getEstadisticasYear(year: number) {
    return await this.createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'suma_montos')
      .where('YEAR(gasto.fecha) = :year', { year: year })
      .getMany();
  }
  async getEstadisticasYearAndMonth(year: number, month: number) {
    return await this.createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'suma_montos')
      .where('YEAR(gasto.fecha) = :year', { year: year })
      .andWhere('MONTH(gasto.fecha) = :month', { month: month })
      .getMany();
  }
  async getEstadisticasYearMonthAndDay(
    year: number,
    month: number,
    day: number,
  ) {
    return await this.createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'suma_montos')
      .where('YEAR(gasto.fecha) = :year', { year: year })
      .andWhere('MONTH(gasto.fecha) = :month', { month: month })
      .andWhere('DAY(gasto.fecha) = :day', { day: day })
      .getMany();
  }
}
