import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { empleadoDto } from './dto/empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(@InjectRepository(Empleado) private empleadoTable: Repository<Empleado>) { }
  async create(empleadoDto: empleadoDto) {
    return await this.empleadoTable.insert(empleadoDto);
  }

  async findAll(): Promise<Empleado[] | NotFoundException> {
    return await this.empleadoTable.find({ relations: { tipo_cargo: true } }).then(response => {
      if (response.length > 0) {
        return response;
      }
      return new NotFoundException('No se encontraron empleados');
    });
  }

  async findOne(cedula: number): Promise<Empleado | Empleado[] | NotFoundException> {
    return await this.empleadoTable.find({ relations: { tipo_cargo: true }, where: { cedula: cedula } }).then(response => {
      if (response.length > 0) {
        return response;
      }
      return new NotFoundException(`No se encontro el empleado con la cedula: ${cedula}`);
    });
  }

  async update(empleado: empleadoDto) {
    let existe = await this.empleadoExiste(empleado.cedula);
    if (!existe) { return new NotFoundException(`No se encontro el empleado con la cedula ${empleado.cedula}`) }
    return await this.empleadoTable.update({ cedula: empleado.cedula }, empleado);
  }

  async remove(cedula: number) {
    let existe = await this.empleadoExiste(cedula);
    if (!existe) { return new NotFoundException(`No se encontro el empleado con la cedula ${cedula}`) }
    return await this.empleadoTable.delete({ cedula: cedula });
  }

  async empleadoExiste(cedula: number): Promise<boolean> {
    return await this.empleadoTable.findBy({ cedula: cedula }).then(response => {
      if (response.length > 0) {
        return true;
      }
      return false;
    });
  }
}
