import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from './dto/empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { TipoCargoService } from 'src/tipo-cargo/tipo-cargo.service';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @Inject(TipoCargoService) private tipoCargoService: TipoCargoService,
  ) {}
  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const existEmpleado = await this.checkIfExistByCedula(
      createEmpleadoDto.cedula,
    );
    if (!existEmpleado) {
      const tipoCargo: any = createEmpleadoDto.tipoCargo;
      const existTipoCargo =
        await this.tipoCargoService.checkIfExistByIdAndActive(tipoCargo);
      if (existTipoCargo) {
        try {
          return await this.empleadoRepository.insert(createEmpleadoDto);
        } catch (error) {
          return this.handleBDerrors(error);
        }
      }
      return new NotFoundException(`No existe el tipo de cargo enviado`);
    }
    return this.handleBDerrors(
      `Ya existe un empleado con cédula ${createEmpleadoDto.cedula}`,
    );
  }

  async findAll() {
    try {
      return await this.empleadoRepository
        .find({
          where: { estado: true },
          select: ['cedula', 'nombre', 'telefono', 'direccion', 'tipoCargo'],
          order: {
            nombre: 'ASC',
          },
          relations: {
            tipoCargo: true,
          },
        })
        .then((empleado) => {
          return empleado.length > 0
            ? empleado
            : new NotFoundException('No hay registrado ningún empleado');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async findOne(cedula: number) {
    try {
      return await this.empleadoRepository
        .findOne({
          where: { cedula: cedula },
          select: ['cedula', 'nombre', 'telefono', 'direccion', 'tipoCargo'],
          relations: {
            tipoCargo: true,
          },
        })
        .then((empleado) => {
          return empleado != null
            ? empleado
            : new NotFoundException(
                `No hay registrado ningún empleado con cédula: ${cedula}`,
              );
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async update(updateEmpleadoDto: UpdateEmpleadoDto) {
    //Si el número de cédula a actualizar es diferente a la nueva cédula, se desactiva y crea uno nuevo
    const existEmpleadoAct = await this.checkIfExistByCedula(
      updateEmpleadoDto.cedula_act,
    );
    const tipoCargo: any = updateEmpleadoDto.tipoCargo;
    if (updateEmpleadoDto.cedula_act != updateEmpleadoDto.cedula) {
      if (existEmpleadoAct) {
        const existEmpleadoNuevo = await this.checkIfExistByCedula(
          updateEmpleadoDto.cedula,
        );
        if (!existEmpleadoNuevo) {
          const existTipoCargo =
            await this.tipoCargoService.checkIfExistByIdAndActive(tipoCargo);
          if (existTipoCargo) {
            try {
              await this.empleadoRepository.update(
                { cedula: updateEmpleadoDto.cedula_act },
                {
                  estado: false,
                },
              );
              const nuevoEmpleado = {
                cedula: updateEmpleadoDto.cedula,
                nombre: updateEmpleadoDto.nombre,
                telefono: updateEmpleadoDto.telefono,
                direccion: updateEmpleadoDto.direccion,
                tipoCargo: tipoCargo,
              };
              await this.empleadoRepository.insert(nuevoEmpleado);
              return {
                message: 'Empleado actualizado éxito',
                data: nuevoEmpleado,
              };
            } catch (error) {
              return this.handleBDerrors(error);
            }
          }
          return new NotFoundException(
            `No existe el tipo de cargo enviado, cargo: ${tipoCargo}`,
          );
        }
        return new ConflictException(
          `Ya existe un empleado con la cédula ${updateEmpleadoDto.cedula} nueva a crear`,
        );
      }
      return new NotFoundException(
        `No existe un empleado con cédula ${updateEmpleadoDto.cedula_act} para actualizar`,
      );
    }
    //Si las cédulas son iguales
    if (existEmpleadoAct) {
      const existTipoCargo =
        await this.tipoCargoService.checkIfExistByIdAndActive(tipoCargo);
      if (existTipoCargo) {
        const actualizarEmpleado = {
          nombre: updateEmpleadoDto.nombre,
          telefono: updateEmpleadoDto.telefono,
          direccion: updateEmpleadoDto.direccion,
          tipoCargo: tipoCargo,
        };
        await this.empleadoRepository.update(
          { cedula: updateEmpleadoDto.cedula_act },
          actualizarEmpleado,
        );
        return {
          message: 'Empleado actualizado con éxito',
          data: actualizarEmpleado,
        };
      }
      return new NotFoundException(
        `No existe el tipo de cargo enviado, cargo: ${tipoCargo}`,
      );
    }
    return new NotFoundException(
      `No existe un empleado con cédula ${updateEmpleadoDto.cedula_act} para actualizar`,
    );
  }

  async remove(cedula: number) {
    const existEmpleado = await this.checkIfExistByCedula(cedula);
    if (existEmpleado) {
      try {
        await this.empleadoRepository.update(
          { cedula: cedula },
          { estado: false },
        );
        return { message: 'Empleado eliminado con éxito', data: cedula };
      } catch (error) {
        return this.handleBDerrors(error);
      }
    }
    return new NotFoundException(
      `No existe un empleado registrado con cédula ${cedula}`,
    );
  }

  async checkIfExistByCedula(cedula: number): Promise<boolean> {
    return await this.empleadoRepository
      .findBy({ cedula: cedula })
      .then((empleado) => {
        return empleado == null || empleado.length == 0 ? false : true;
      });
  }
  async existEmpleadosByTipoCargo(id_tipo: number): Promise<boolean | any> {
    return await this.empleadoRepository
      .findAndCountBy({ cedula: id_tipo })
      .then((cantEmpleados) => {
        return cantEmpleados;
      });
  }
  private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}
