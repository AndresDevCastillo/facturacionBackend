import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTipoCargoDto, UpdateTipoCargoDto } from './dto/tipo-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCargo } from './entities/tipo-cargo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoCargoService {
  constructor(
    @InjectRepository(TipoCargo)
    private tipoCargoRepository: Repository<TipoCargo>,
  ) {}
  async create(createTipoCargoDto: CreateTipoCargoDto) {
    const existTipoCargo = await this.checkIfExistByCargo(
      createTipoCargoDto.cargo,
    );
    if (!existTipoCargo) {
      try {
        return await this.tipoCargoRepository.insert(createTipoCargoDto);
      } catch (error) {
        return this.handleBDerrors(error);
      }
    }
    return this.handleBDerrors(
      `Ya existe un cargo ${createTipoCargoDto.cargo}`,
    );
  }

  async findAll() {
    try {
      return await this.tipoCargoRepository
        .find({
          where: { estado: true },
          select: ['id', 'cargo'],
        })
        .then((tipoCargo) => {
          return tipoCargo.length > 0
            ? tipoCargo
            : new NotFoundException('No hay registrado ningún tipo de cargo');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.tipoCargoRepository
        .findOne({
          where: { id: id },
          select: ['id', 'cargo'],
        })
        .then((tipoCargo) => {
          return tipoCargo != null
            ? tipoCargo
            : new NotFoundException(
                `No hay registrado ningún tipo de cargo con id: ${id}`,
              );
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async update(updateTipoCargoDto: UpdateTipoCargoDto) {
    const existTipoCargoId = await this.checkIfExistById(updateTipoCargoDto.id);
    if (existTipoCargoId) {
      const existTipoCargo = await this.checkIfExistByCargo(
        updateTipoCargoDto.cargo,
      );
      if (!existTipoCargo) {
        try {
          await this.tipoCargoRepository.update(updateTipoCargoDto.id, {
            estado: false,
          });
          const crear = { cargo: updateTipoCargoDto.cargo };
          await this.create(crear);
          return {
            message: 'Tipo de cargo actualizado con éxito',
            data: crear,
          };
        } catch (error) {
          return this.handleBDerrors(error);
        }
      }
      return new ConflictException(
        'Ya existe un tipo de cargo idéntico al enviado',
      );
    }
    return new NotFoundException(
      'No se encontró el tipo de cargo a actualizar',
    );
  }

  async remove(id: number) {
    const existTipoCargo = await this.checkIfExistById(id);
    if (existTipoCargo) {
      try {
        await this.tipoCargoRepository.update(id, { estado: false });
        return { message: 'Se eliminó con éxito', id: id };
      } catch (error) {
        return this.handleBDerrors(error);
      }
    }
    return new NotFoundException('No se encontró el tipo de cargo a eliminar');
  }

  private async checkIfExistByCargo(cargo: string): Promise<boolean | void> {
    try {
      return await this.tipoCargoRepository
        .findBy({ cargo: cargo, estado: true })
        .then((tipoCargo) => {
          return tipoCargo == null || tipoCargo.length == 0 ? false : true;
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async checkIfExistById(id: number): Promise<boolean | void> {
    try {
      return await this.tipoCargoRepository
        .findBy({ id: id })
        .then((tipoCargo) => {
          return tipoCargo == null || tipoCargo.length == 0 ? false : true;
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async checkIfExistByIdAndActive(id: number): Promise<boolean | void> {
    try {
      return await this.tipoCargoRepository
        .findBy({ estado: true, id: id })
        .then((tipoCargo) => {
          return tipoCargo == null || tipoCargo.length == 0 ? false : true;
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}
