import { HttpException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
  ) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    const idEmpleado: any = createUsuarioDto.empleado; //id Empleado:number
    const usuario = {
      usuario: createUsuarioDto.usuario,
      contrasena: bcrypt.hashSync(createUsuarioDto.contrasena, 10),
      empleado: createUsuarioDto.empleado,
    };
    const existUser = await this.existUser(idEmpleado);
    if (existUser.length == 0) {
      try {
        return await this.usuarioRepository.insert(usuario);
      } catch (error) {
        this.handleBDerrors(error);
      }
    }
    this.handleBDerrors('El empleado ya tiene un usuario asignado');
  }

  async findAll() {
    return await this.usuarioRepository.find({ relations: { empleado: true } });
  }

  async findOne(id: number) {
    return await this.usuarioRepository.findOneBy({ id: id });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  async remove(id: number) {
    return await this.usuarioRepository.delete({ id: id });
  }

  async existUser(idEmpleado: number) {
    return await this.usuarioRepository.findBy({
      empleado: { id: idEmpleado },
    });
  }
  private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}
