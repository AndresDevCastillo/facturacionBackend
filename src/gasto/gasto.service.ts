import { HttpException, Injectable } from '@nestjs/common';
import { CreateGastoDto } from './dto/gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { Repository } from 'typeorm';
import { GastoRepositoryService } from './entities/gasto.repository';

@Injectable()
export class GastoService {
  constructor(
    private readonly gastoCustomerService: GastoRepositoryService,
    @InjectRepository(Gasto) private gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto) {
    const colombiaTimezone = 'America/Bogota';
    const now = new Date();

    const { DateTime } = require('luxon');
    const colombiaDateTime = DateTime.fromJSDate(now, {
      zone: colombiaTimezone,
    });

    const fecha = colombiaDateTime.toJSDate();
    const hora = colombiaDateTime.toFormat('HH:mm:ss');
    const newGasto = {
      ...createGastoDto,
      fecha,
      hora,
    };
    try {
      return await this.gastoRepository.insert(newGasto);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async findAll() {
    try {
      return await this.gastoRepository.find();
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.gastoRepository.delete(id);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async gastoDiario(year: number, month: number, day: number) {
    try {
      return await this.gastoCustomerService.getEstadisticasYearMonthAndDay(
        year,
        month,
        day,
      );
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async gastoMensual(year: number, month: number) {
    try {
      return await this.gastoCustomerService.getEstadisticasYearAndMonth(
        year,
        month,
      );
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async gastoAnual(year: number) {
    try {
      return await this.gastoCustomerService.getEstadisticasYear(year);
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
