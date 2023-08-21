import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMesaDto, UpdateMesaDto } from './dto/mesa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa) private mesaRepository: Repository<Mesa>,
  ) {}

  create(createMesaDto: CreateMesaDto) {
    try {
      return this.mesaRepository.insert(createMesaDto);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  findAll() {
    return `This action returns all mesa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mesa`;
  }

  update(updateMesaDto: UpdateMesaDto) {
    return `This action updates a # mesa`;
  }

  remove(id: number) {
    return `This action removes a #${id} mesa`;
  }
  private async checkIfExist(id: number) {
    try {
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  private handleBDerrors(error: any) {
    console.log(error);
    throw new InternalServerErrorException('Revise los Logs del sistema');
  }
}
