import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: RegisterDto, imagenPerfil: Express.Multer.File): Promise<User> {
    const usuarioExistente = await this.userModel.findOne({
      $or: [{ correo: dto.correo }, { nombreUsuario: dto.nombreUsuario }],
    });

    if (usuarioExistente) {
      throw new BadRequestException('El usuario o correo ya están registrados');
    }

    const contraseñaEncriptada = await bcrypt.hash(dto.password, 10);
    const imagenPerfilUrl = imagenPerfil ? `/uploads/${imagenPerfil.filename}` : null;

    const usuarioNuevo = new this.userModel({
      ...dto,
      contraseña: contraseñaEncriptada,
      imagenPerfilUrl,
    });

    return usuarioNuevo.save();
  }

  async login(dto: LoginDto): Promise<User> {
    const usuario = await this.userModel.findOne({
      $or: [{ correo: dto.nombreUsuarioOEmail }, { nombreUsuario: dto.nombreUsuarioOEmail }],
    });

    if (!usuario) throw new BadRequestException('Usuario no encontrado');

    const contrasenaValida = await bcrypt.compare(dto.contraseña, usuario.password);

    if (!contrasenaValida) throw new BadRequestException('Contraseña incorrecta');

    return usuario;
  }
}
