import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria) private categoriaTabla: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      return await this.categoriaTabla.insert(createCategoriaDto);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async findAll(): Promise<Categoria[] | NotFoundException | Categoria> {
    try {
      return await this.categoriaTabla
        .find({
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
          where: {
            estado: true,
          },
        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp;
          }
          return new NotFoundException('No se encontraron categorias');
        });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async findOne(id: number): Promise<Categoria | NotFoundException> {
    try {
      return await this.categoriaTabla
        .find({
          where: { id: id, estado: true },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp[0];
          }
          return new NotFoundException(
            `No se encontro la categoria con el id  ${id}`,
          );
        });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async update(updateCategoriaDto: UpdateCategoriaDto) {
    try {
      let nuevaCategoria = { ...updateCategoriaDto };
      await this.remove(nuevaCategoria.id);
      delete nuevaCategoria.id;
      return await this.create(nuevaCategoria);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(id: number) {
    try {
      let existe = await this.ExisteCategoria(id);
      if (existe) {
        return await this.categoriaTabla.update(id, { estado: false });
      }
      return new NotFoundException(
        `No se encontro la categoria con el id  ${id}`,
      );
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async ExisteCategoria(id: number) {
    try {
      return await this.categoriaTabla
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
