import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './dto/empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { DataSource, Repository, Not, In } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class EmpleadoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(empleado: CreateEmpleadoDto) {
    try {
      const existe = await this.checkIfExist(empleado.cedula);
      if (existe) {
        return new BadRequestException({
          message: 'El empleado ya existe',
          body: empleado,
        });
      }
      return await this.empleadoRepository.insert(empleado);
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async findAll() {
    try {
      return await this.empleadoRepository
        .find({
          where: { estado: true },
          select: {
            cedula: true,
            nombre: true,
            telefono: true,
            id: true,
            direccion: true,
            tipoCargo: true,
          },
        })
        .then((empleados) => {
          return empleados.length > 0
            ? empleados
            : new NotFoundException('No hay empleados registrados');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }
  async getEmpleadosByEmpresa(cargo = 'Engineersoft') {
    return await this.dataSource
      .getRepository(Empleado)
      .find({ where: { tipoCargo: Not(cargo), estado: true } });
  }
  async getUsuariosByEmpresa(cargo = 'Engineersoft') {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder()
      .innerJoinAndSelect('Usuario.empleado', 'empleado')
      .where('empleado.tipoCargo != :cargo AND empleado.estado = :estado', {
        cargo: cargo,
        estado: true,
      })
      .getMany();
  }
  async getEmpleadosSinUsuario() {
    const empleadoUserId = await this.getUsuariosByEmpresa();
    const empleadosId = empleadoUserId.map((usuario) => {
      return usuario.empleado.id;
    });
    return await this.dataSource.getRepository(Empleado).find({
      where: {
        id: Not(In(empleadosId)),
        estado: true,
        tipoCargo: Not('Engineersoft'),
      },
    });
  }

  async getCargos() {
    const cargos = ['Mesero', 'Cajero', 'Admin', 'Engineersoft', 'Cocinero'];
    return cargos;
  }
  async getCargosEmpresa() {
    const cargos = ['Mesero', 'Cajero', 'Cocinero'];
    return cargos;
  }
  async findOne(cedula: number) {
    try {
      return await this.empleadoRepository
        .find({
          where: { estado: true, cedula: cedula },
          select: {
            cedula: true,
            nombre: true,
            telefono: true,
            id: true,
            tipoCargo: true,
          },
        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp;
          }
          return new NotFoundException('No se encontro el cliente');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }
  async update(empleadoDto: UpdateEmpleadoDto) {
    try {
      const existe = await this.checkIfExist(empleadoDto.cedula);
      if (existe) {
        const USEROLD = await this.empleadoRepository.findOneBy({
          cedula: empleadoDto.cedula,
          estado: true,
        });
        await this.remove(empleadoDto.cedula);
        return await this.create(empleadoDto).then(async (resp: any) => {
          await this.usuarioRepository.update(
            { empleado: { id: USEROLD.id } },
            { empleado: { id: resp.raw.insertId } },
          );
        });
      }
      return new NotFoundException({
        Message: 'No se encontro el cliente',
        Body: { empleadoDto },
      });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(cedula: number) {
    try {
      const existe = await this.checkIfExist(cedula);
      if (existe) {
        return this.empleadoRepository
          .update({ cedula: cedula }, { estado: false })
          .then(() => {
            return cedula;
          });
      }
      return new NotFoundException({
        Message: 'La cedula no existe',
        Cedula: cedula,
      });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }
  async removeEnserio(cedula: number) {
    try {
      const existe = await this.checkIfExist(cedula);
      if (existe) {
        const EMPLEADO = await this.empleadoRepository.findOneBy({
          cedula: cedula,
          estado: true,
        });
        const USER = await this.usuarioRepository.findOneBy({
          empleado: { id: EMPLEADO.id },
        });
        if (USER) {
          await this.usuarioRepository.delete(USER.id);
        }
        return await this.empleadoRepository.update(
          { cedula: cedula },
          { estado: false },
        );
      }
      return new NotFoundException({
        Message: 'La cedula no existe',
        Cedula: cedula,
      });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  private async checkIfExist(cedula: number) {
    try {
      const cliente: any = await this.empleadoRepository.findBy({
        cedula: cedula,
        estado: true,
      });
      if (cliente.length > 0) {
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
