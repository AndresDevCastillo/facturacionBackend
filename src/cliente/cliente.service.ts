import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClienteDto } from './dto/cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: ClienteDto) {
    const existe = await this.checkIfExist(createClienteDto.cedula);
    if (!existe) {
      try {
        const cliente = await this.clienteRepository.insert(createClienteDto);
        return await this.findOne(createClienteDto.cedula);
      } catch (error) {
        return this.handleBDerrors(error);
      }
    }
    return this.handleBDerrors(
      `Ya existe un cliente con cédula: ${createClienteDto.cedula}`,
      409,
    );
  }

  async findAll() {
    try {
      return await this.clienteRepository
        .find({
          where: { estado: true },
          select: {
            cedula: true,
            correo: true,
            nombre: true,
            telefono: true,
            id: true,
          },
        })
        .then((resp) => {
          if (resp.length > 0) {
            return resp;
          }
          return new NotFoundException('No hay clientes registrados');
        });
    } catch (error) {
      return this.handleBDerrors(error);
    }
  }

  async findOne(cedula: number) {
    try {
      return await this.clienteRepository
        .find({
          where: { estado: true, cedula: cedula },
          select: {
            id: true,
            cedula: true,
            correo: true,
            nombre: true,
            telefono: true,
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

  async update(updateClienteDto: ClienteDto) {
    try {
      const existe = await this.checkIfExist(updateClienteDto.cedula);
      if (existe) {
        await this.remove(updateClienteDto.cedula);
        return await this.create(updateClienteDto);
      }
      return new NotFoundException({
        Message: 'No se encontro el cliente',
        Body: { updateClienteDto },
      });
    } catch (error) {
      this.handleBDerrors(error);
    }
  }

  async remove(cedula: number) {
    try {
      const existe = await this.checkIfExist(cedula);
      if (existe) {
        return this.clienteRepository.update(
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
      const cliente: any = await this.clienteRepository.findBy({
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

  private handleBDerrors(error: any, codeError = 500) {
    console.log(error);
    throw new HttpException(
      { message: error, suggest: 'Por favor revise los logs del sistema' },
      codeError,
      {
        cause: error,
      },
    );
  }
}
