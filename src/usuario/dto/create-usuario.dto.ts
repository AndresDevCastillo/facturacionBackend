import { IsNotEmpty, IsString } from 'class-validator';
import { Empleado } from 'src/empleado/entities/empleado.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  readonly usuario: string;

  @IsNotEmpty()
  readonly contrasena: string;

  @IsNotEmpty()
  readonly empleado: Empleado;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  readonly usuario: string;

  @IsNotEmpty()
  readonly contrasena: string;
}
