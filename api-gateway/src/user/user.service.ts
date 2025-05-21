import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient, GetUserRequest, GetUserResponse, CreateUserRequest, CreateUserResponse, USER_PACKAGE_NAME, USER_SERVICE_NAME } from '../../../shared/proto/ts/user';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { GrpcErrorMapper } from '../../../shared/errors/grpc-error.mapper';

@Injectable()
export class UserService {
  private userService: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private client: ClientGrpc) {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async getUser(id: number) {
    try {
      const user = await firstValueFrom(this.userService.getUser({ id }, {} as Metadata));
      return user;
    } catch (error) {
      console.log('[api-gateway] Error from gRPC:', error);
      GrpcErrorMapper.map(error);
    }
  }

  async createUser(data: CreateUserRequest) {
    try {
      return await firstValueFrom(this.userService.createUser(data, {} as Metadata));
    } catch (error) {
      console.log('[api-gateway] Error from gRPC:', error);
      GrpcErrorMapper.map(error);
    }
  }
} 