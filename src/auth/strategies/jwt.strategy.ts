import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-strategy.interface';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @Inject(JwtService) private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Usuario | { access_token: string }> {
    const { usuario } = payload;
    const userBd = await this.usuarioRepository.find({
      where: { usuario: usuario },
      relations: { empleado: true },
      select: ['id', 'contrasena', 'empleado', 'usuario'],
    });
    if (userBd.length == 0) {
      throw new UnauthorizedException('El usuario no esta registrado');
    }
    const payloadZ = {
      sub: userBd[0].id,
      usuario: userBd[0].usuario,
      rol: userBd[0].empleado.tipoCargo.cargo,
    };
    return {
      ...userBd,
      access_token: await this.jwtService.signAsync(payloadZ),
    };
  }

  async loginJwt(payload: JwtPayload): Promise<any> {
    const { usuario, contrasena } = payload;

    const userBd = await this.usuarioRepository.find({
      where: { usuario: usuario },
      relations: { empleado: true },
      select: ['id', 'contrasena', 'empleado', 'usuario'],
    });
    if (userBd.length == 0) {
      throw new UnauthorizedException('El usuario no esta registrado');
    } else if (!bcrypt.compareSync(contrasena, userBd[0].contrasena)) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }
    const payloadZ = {
      sub: userBd[0].id,
      usuario: userBd[0].usuario,
      rol: userBd[0].empleado,
    };
    userBd[0].contrasena = null;
    const userReturn = {
      id: userBd[0].id,
      empleado: userBd[0].empleado,
      usuario: userBd[0].usuario,
      access_token: await this.jwtService.signAsync(payloadZ),
    };
    return userReturn;
  }
}
