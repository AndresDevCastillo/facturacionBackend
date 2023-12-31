import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateInventarioDto, updateInventarioDto } from './dto/inventario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { MoreThan, Repository } from 'typeorm';
import { inventarioCustomRepository } from './entities/inventario.repository';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    private inventarioCustomRepository: inventarioCustomRepository,
  ) {}

  async create(producto: CreateInventarioDto) {
    try {
      let existeProducto: boolean = false;
      const inventario: any = await this.inventarioRepository.find({
        relations: { producto: true },
      });
      inventario.map((inventario: any) => {
        if (producto.producto == inventario.producto.id) {
          existeProducto = true;
        }
      });
      if (existeProducto) {
        return new BadRequestException(
          'Ya existe el producto en el inventario',
        );
      }
      return await this.inventarioRepository.insert(producto);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async findAll() {
    try {
      return await this.inventarioRepository.find({
        where: {
          estado: true,
        },
        relations: {
          producto: true,
        },
      });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async productosSinInvetario() {
    try {
      return this.inventarioCustomRepository.productosSinInventarios();
    } catch(error) {
       this.handleBDerrors(error);  
    }
  }
  async update(inventario: updateInventarioDto) {
    try {
      return await this.inventarioRepository.update(inventario.id, inventario);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.inventarioRepository.delete(id);
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
