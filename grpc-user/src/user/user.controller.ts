import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserServiceController, UserServiceControllerMethods, GetUserRequest, GetUserResponse, CreateUserRequest, CreateUserResponse } from '../../../shared/proto/ts/user';

@Controller()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const user = await this.userService.findOne(request.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const user = await this.userService.create(request);
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
} 