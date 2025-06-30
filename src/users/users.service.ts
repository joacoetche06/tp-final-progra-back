import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getPerfil(userId: string) {
    const usuario = await this.userModel
      .findById(userId)
      .select('-password') // 👈 para no devolver la contraseña
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    console.log('Usuario encontrado:', usuario);

    return usuario;
  }
}
