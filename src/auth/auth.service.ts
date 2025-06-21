import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, imagenPerfil: Express.Multer.File | null): Promise<any> {
    const exists = await this.userModel.findOne({
      $or: [
        { correo: dto.correo.toLowerCase() },
        { nombreUsuario: dto.nombreUsuario.toLowerCase() },
      ],
    });
    if (exists) throw new BadRequestException('Usuario o correo ya registrados');

    const hashed = await bcrypt.hash(dto.password, 12);
    const imagenPerfilUrl = imagenPerfil ? `/uploads/${imagenPerfil.filename}` : null;

    const user = new this.userModel({
      nombre: dto.nombre,
      apellido: dto.apellido,
      correo: dto.correo.toLowerCase(),
      nombreUsuario: dto.nombreUsuario.toLowerCase(),
      password: hashed,
      descripcion: dto.descripcion,
      fechaNacimiento: dto.fechaNacimiento,
      perfil: 'user',
      imagenPerfilUrl,
    });
    const saved = await user.save();
    const { password, ...u } = saved.toObject();
    return { success: true, message: 'Registrado correctamente', data: u };
  }

  async login(dto: LoginDto): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [
        { correo: dto.nombreUsuarioOEmail.toLowerCase() },
        { nombreUsuario: dto.nombreUsuarioOEmail.toLowerCase() },
      ],
    });
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new BadRequestException('Contraseña incorrecta');

    const { password, ...u } = user.toObject();
    const payload = { sub: user._id, username: user.nombreUsuario, perfil: user.perfil };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    return { success: true, message: 'Login exitoso', data: u, access_token };
  }

  verifyToken(token: string): any {
    console.log(token);
    return this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'secreto' });
  }

  refreshToken(user: any): string {
    const payload = { sub: user.id, username: user.username, perfil: user.perfil };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }
}
