// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/users.schema';
import { RmqService } from 'src/rmq/rmq.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly rmqService: RmqService, 
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    await this.rmqService.sendMessage('user_created', { id: savedUser._id, email: savedUser.email });

    return savedUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async updateUser(id: string, email: string, password?: string): Promise<User> {
    const updateData: Partial<User> = { email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.rmqService.sendMessage('user_updated', { id: updatedUser._id, email: updatedUser.email });

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.rmqService.sendMessage('user_deleted', { id });
  }
}
