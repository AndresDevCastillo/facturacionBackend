import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(@InjectRepository(Categoria) private categoriaTabla: Repository<Categoria>) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      return await this.categoriaTabla.insert(createCategoriaDto);
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Por favor revisa los logs del sistema');
    }
  }

  async findAll(): Promise<Categoria[] | NotFoundException | Categoria> {
    try {
      return await this.categoriaTabla.find({
        select: {
        id: true, nombre: true, descripcion: true
      },
      where: {
        estado: true,
      }
    }).then(resp => {
        if (resp.length > 0) { return resp; }
        return new NotFoundException('No se encontraron categorias');
      });
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Por favor revisa los logs del sistema');
    }
  }

  async findOne(id: number): Promise<Categoria | NotFoundException> {
    try {
      return await this.categoriaTabla.find({ where: { id: id , estado: true }, select: {
        id: true, nombre: true, descripcion: true} }).then(resp => {
        if (resp.length > 0) {
          return resp[0];
        }
        return new NotFoundException(`No se encontro la categoria con el id  ${id}`);
      });
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Por favor revisa los logs del sistema');
    }
  }

  async update(updateCategoriaDto: UpdateCategoriaDto) {
  let nuevaCategoria  = {...updateCategoriaDto}; 
  await this.remove(nuevaCategoria.id);
  delete nuevaCategoria.id;
  return await this.create(nuevaCategoria);
  }

  async remove(id: number) {
    let existe = await this.ExisteCategoria(id);
    if (existe) {
      return await this.categoriaTabla.update(id, {estado: false});
    }
    return new NotFoundException(`No se encontro la categoria con el id  ${id}`);
  }

  async ExisteCategoria(id: number) {
    try {
      return await this.categoriaTabla.find({ where: { id: id, estado: true } }).then(resp => {
        if (resp.length > 0) { return true }
        return false;
      });
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Por favor revisa los logs del sistema');
    }
  }
}
