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
      .select('SUM(gasto.monto)', 'gastoTotal')
      .where('YEAR(gasto.fecha) = :year', { year: year })
      .getRawOne();
  }
  async getEstadisticasYearAndMonth(year: number, month: number) {
    return await this.createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'gastoTotal')
      .where('YEAR(gasto.fecha) = :year', { year: year })
      .andWhere('MONTH(gasto.fecha) = :month', { month: month })
      .getRawOne();
  }
  async getEstadisticasYearMonthAndDay(
    year: number,
    month: number,
    day: number,
  ) {
    return await this.createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'gastoTotal')
      .where('YEAR(gasto.fecha) = :year', { year: year })
      .andWhere('MONTH(gasto.fecha) = :month', { month: month })
      .andWhere('DAY(gasto.fecha) = :day', { day: day })
      .getRawOne();
  }
}
