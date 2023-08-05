import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoCargoDto } from './dto/create-tipo-cargo.dto';
import { UpdateTipoCargoDto } from './dto/update-tipo-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCargo } from './entities/tipo-cargo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoCargoService {
  constructor(@InjectRepository(TipoCargo) private tipoCargoTable: Repository<TipoCargo>,) { }

  async create(createTipoCargoDto: CreateTipoCargoDto) {
    return await this.tipoCargoTable.insert(createTipoCargoDto);
  }

  async findAll(): Promise<TipoCargo[] | NotFoundException> {
    return await this.tipoCargoTable.find().then((response) => {
      if (response.length > 0) {
        return response;
      }
      return new NotFoundException('No se encontraron tipos de cargo');
    });
  }

  async findOne(id: number): Promise<TipoCargo[] | TipoCargo | NotFoundException> {
    return await this.tipoCargoTable.findBy({ id: id }).then(response => {
      if (response) {
        return response;
      }
      return new NotFoundException(`No se encontro el tipo de cargo con el id ${id}`)
    });
  }

  async update(updateTipoCargoDto: UpdateTipoCargoDto) {
    return await this.tipoCargoTable.update({ id: updateTipoCargoDto.id }, updateTipoCargoDto)
  }

  async delete(id: number) {
    return await this.tipoCargoTable.delete({ id: id });
  }
}
