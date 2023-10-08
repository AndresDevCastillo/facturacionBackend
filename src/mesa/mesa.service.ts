import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMesaDto } from './dto/mesa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa) private mesaRepository: Repository<Mesa>,
  ) {}

  async create(createMesaDto: CreateMesaDto) {
    try {
      return this.mesaRepository.insert(createMesaDto);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async createMany(numero: number) {
    try {
      const mesasInsert = [];
      for (let i = 1; i <= numero; i++) {
        mesasInsert.push({
          nombre: 'Mesa ' + i
        });
      }
      mesasInsert.push({nombre: 'Domicilio'}, {nombre: 'Recogido en persona'});
      const resp = await this.mesaRepository.insert(mesasInsert);
      return {
        arreglo: mesasInsert,
        respuesta: resp
      };
    } catch (error) {
      this.handleBDerrors(error);
    }
  }


  async findAll() {
    try {
      return await this.mesaRepository
        .find({ where: { estado: true } })
        .then((resp) => {
          if (resp.length > 0) {
            return resp;
          }
          return new NotFoundException('No hay mesas resgitradas');
        });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.mesaRepository
        .find({ where: { estado: true, id: id } })
        .then((resp) => {
          if (resp.length > 0) {
            return resp[0];
          }
          return new NotFoundException(
            `No se encontro la mesa con el id ${id}`,
          );
        });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async update(updateMesaDto) {
    try {
      let existe = await this.checkIfExist(updateMesaDto.id);
      if (existe) {
        await this.remove(updateMesaDto.id);
        delete updateMesaDto.id;
        return await this.create(updateMesaDto);
      }
      return new NotFoundException('No se encontro la mesa a actualizar');
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(id: number) {
    try {
      let existe = await this.checkIfExist(id);
      if (existe) {
        return await this.mesaRepository.update({ id: id }, { estado: false });
      }
      return new NotFoundException('No se encontro la mesa a eliminar');
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  private async checkIfExist(id: number) {
    try {
      return await this.mesaRepository
        .find({ where: { id: id, estado: true } })
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
    throw new InternalServerErrorException('Revise los Logs del sistema');
  }
}
