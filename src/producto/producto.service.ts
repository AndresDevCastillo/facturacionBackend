import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      return await this.productoRepository.insert(createProductoDto);
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async findAll() {
    try {
      return await this.productoRepository
        .find({
          where: { estado: true },
          select: { id: true, descripcion: true, nombre: true },
          relations: { categoria: true },
        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp;
          }
          return new NotFoundException('No');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.productoRepository
        .find({
          where: { estado: true, id: id },
          select: { id: true, descripcion: true, nombre: true },
          relations: { categoria: true },
        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp;
          }
          return new NotFoundException('No se encontro el producto');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async update(updateProductoDto) {
    let existe = await this.checkIfExist(updateProductoDto.id);
    if (existe) {
      try {
        await this.productoRepository.update(updateProductoDto.id, {
          estado: false,
        });
        delete updateProductoDto.id;
        await this.create(updateProductoDto);
        return { message: 'Se Actualizo con exito!', data: updateProductoDto };
      } catch (error) {
        return this.handleBDerrors(error);
      }
    }
    return new NotFoundException('No se encontró el producto por actualizar');
  }

  async remove(id: number) {
    let existe = await this.checkIfExist(id);
    if (existe) {
      try {
        await this.productoRepository.update(id, { estado: false });
        return { message: 'Se elimino con exito!', id: id };
      } catch (error) {
        this.handleBDerrors(error);
      }
    }
    return new NotFoundException('No se encontro el producto a eliminar');
  }

  private async checkIfExist(id: number) {
    try {
      const producto: any = await this.findOne(id);
      if (producto.length > 0) {
        return true;
      }
      return false;
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
