import { Controller, Get, Post, Body, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@ApiTags('users')
@Controller('users')
// @UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a hello message',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Hello World',
        },
      },
    },
  })
  async hello() {
    return {
      message: 'Hello World',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user',
    type: UserResponseDto,
  })
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
    type: UserResponseDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
} 