import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { User } from './user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  getUsers() {
    return this.index();
  }

  async getUserByUsername(username: string) {
    return await this.findByColumn('username', username);
  }

  async getUserByEmail(email: string) {
    return await this.findByColumn('email', email);
  }

  async getUserById(id: string) {
    return await this.findById(id);
  }

  async storeUser(user: Partial<User>) {
    return await this.store(user);
  }

  async updateUser(id: string, user: Partial<User>) {
    return await this.update(id, user);
  }

  async deleteUser(id: string) {
    return await this.delete(id);
  }

  async adminSetNewPassword(id: string) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new BadGatewayException('User not found');
    }

    user.password = '123456';

    await this.updateUser(id, user);
  }

  async changePassword(id: string, password: string) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new BadGatewayException('User not found');
    }

    password = await argon2.hash(password);

    user.password = password;

    await this.updateUser(id, user);
  }
}
