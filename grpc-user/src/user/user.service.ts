import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserRequest } from '../../../shared/proto/ts/user';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      console.log('[grpc-user] Service: User not found, throwing RpcException');
      throw new RpcException({
        code: GrpcStatus.NOT_FOUND,
        details: `User with ID ${id} not found`,
        message: 'USER_NOT_FOUND'
      });
    }
    return user;
  }

  async create(data: CreateUserRequest): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }
} 