import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
    imagenPerfil: Express.Multer.File,
  ): Promise<any> {
    const usuarioExistente = await this.userModel.findOne({
      $or: [
        { correo: dto.correo.toLowerCase() },
        { nombreUsuario: dto.nombreUsuario.toLowerCase() },
      ],
    });

    if (usuarioExistente) {
      throw new BadRequestException('El usuario o correo ya están registrados');
    }

    const encryptPassword = await bcrypt.hash(dto.password, 12);
    const imagenPerfilUrl = imagenPerfil
      ? `/uploads/${imagenPerfil.filename}`
      : null;

    const usuarioNuevo = new this.userModel({
      nombre: dto.nombre,
      apellido: dto.apellido,
      correo: dto.correo,
      nombreUsuario: dto.nombreUsuario,
      password: encryptPassword,
      descripcion: dto.descripcion ? dto.descripcion : null,
      fechaNacimiento: dto.fechaNacimiento ? dto.fechaNacimiento : null,
      perfil: 'user',
      imagenPerfilUrl,
    });

    const savedUser = await usuarioNuevo.save();
    const { password, ...userSinPassword } = savedUser.toObject();

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      data: userSinPassword,
    };
  }

  async login(dto: LoginDto): Promise<any> {
    const usuario = await this.userModel.findOne({
      $or: [
        { correo: dto.nombreUsuarioOEmail },
        { nombreUsuario: dto.nombreUsuarioOEmail },
      ],
    });

    if (!usuario) throw new BadRequestException('Usuario no encontrado');

    const validPassword = await bcrypt.compare(dto.password, usuario.password);
    if (!validPassword) throw new BadRequestException('Contraseña incorrecta');

    const { password, ...userSinPassword } = usuario.toObject();

    const payload = {
      sub: usuario._id,
      username: usuario.nombreUsuario,
      perfil: usuario.perfil,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Usuario logueado correctamente',
      data: userSinPassword,
      access_token: token,
    };
  }
}
