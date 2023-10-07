import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './dto/empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { TipoCargoService } from 'src/tipo-cargo/tipo-cargo.service';

@Injectable()
export class EmpleadoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @Inject(TipoCargoService) private tipoCargoService: TipoCargoService,
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
      return await this.dataSource
        .getRepository(Empleado)
        .find({
          where: { tipoCargo: { cargo: Not('Engineersoft') } },
          select: ['id', 'cedula', 'nombre', 'telefono', 'direccion'],
          relations: { tipoCargo: true },
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

  async findOne(cedula: number) {
    try {
      return await this.empleadoRepository
        .find({
          where: { estado: true, cedula: cedula },
          select: { cedula: true, nombre: true, telefono: true, id: true },
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
        await this.remove(empleadoDto.cedula);
        return await this.create(empleadoDto);
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
        return this.empleadoRepository.update(
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
