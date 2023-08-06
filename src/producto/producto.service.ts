import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoService {
  constructor(@InjectRepository(Producto) private productoTabla: Repository<Producto>) { }

  async create(createProductoDto: CreateProductoDto) {
    return await this.productoTabla.insert(createProductoDto);
  }

  async findAll(): Promise<Producto[] | NotFoundException> {
    return await this.productoTabla.find({ relations: { categoria: true } }).then((resp) => {
      if (resp.length > 0) { return resp; }
      return new NotFoundException(`No se encontraron productos`);
    });
  }

  async findOne(id: number): Promise<Producto | NotFoundException> {
    return await this.productoTabla.find({ where: { id: id }, relations: { categoria: true } }).then(resp => {
      if (resp.length > 0) { return resp[0] }
      return new NotFoundException(`No se encontro el producto con el id ${id}`);
    });
  }

  async update(updateProductoDto: UpdateProductoDto) {
    let existe = this.existeProducto(updateProductoDto.id);
    if (existe) {
      return await this.productoTabla.update({ id: updateProductoDto.id }, updateProductoDto)
    }
    return new NotFoundException(`No se encontro el producto con el ${updateProductoDto.id}`)
  }

  async remove(id: number) {
    let existe = await this.existeProducto(id);
    if (existe) { return await this.productoTabla.delete({ id: id }) }
    return new NotFoundException(`No se encontro el producto con el ${id}`)
  }

  async existeProducto(id: number): Promise<boolean> {
    return await this.productoTabla.find({ where: { id: id } }).then(resp => {
      if (resp.length > 0) { return true; }
      return false;
    })
  }
}
