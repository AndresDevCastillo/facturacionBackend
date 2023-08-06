import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(@InjectRepository(Categoria) private categoriaTabla: Repository<Categoria>) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    return await this.categoriaTabla.insert(createCategoriaDto);
  }

  async findAll(): Promise<Categoria[] | NotFoundException | Categoria> {
    return await this.categoriaTabla.find().then(resp => {
      if (resp.length > 0) { return resp; }
      return new NotFoundException('No se encontraron categorias');
    });
  }

  async findOne(id: number): Promise<Categoria | NotFoundException> {
    return await this.categoriaTabla.find({ where: { id: id } }).then(resp => {
      if (resp.length > 0) {
        return resp[0];
      }
      return new NotFoundException(`No se encontro la categoria con el id  ${id}`);
    });
  }

  async update(updateCategoriaDto: UpdateCategoriaDto) {
    let existe = await this.ExisteCategoria(updateCategoriaDto.id);
    if (existe) {
      return await this.categoriaTabla.update({ id: updateCategoriaDto.id }, updateCategoriaDto);
    }
    return new NotFoundException(`No se encontro la categoria con el id  ${updateCategoriaDto.id}`);
  }

  async remove(id: number) {
    let existe = await this.ExisteCategoria(id);
    if (existe) {
      return await this.categoriaTabla.delete({ id: id });
    }
    return new NotFoundException(`No se encontro la categoria con el id  ${id}`);
  }

  async ExisteCategoria(id: number) {
    return await this.categoriaTabla.find({ where: { id: id } }).then(resp => {
      if (resp.length > 0) { return true }
      return false;
    });
  }
}
