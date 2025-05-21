import { status } from '@grpc/grpc-js';
import { NotFoundException, InternalServerErrorException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

export class GrpcErrorMapper {
  static map(error: any): never {
    console.log('[GrpcErrorMapper] Received error:', error);
    console.log('error.details:', error.details);

    // Handle gRPC errors
    if (error.code) {
      console.log('[GrpcErrorMapper] Handling gRPC error with code:', error.code);
      
      const errorMessage = error.details || error.message;

      console.log({
        message: error.message,
        details: error.details,
        code: error.code,
      })
      
      switch (error.code) {
        case status.NOT_FOUND:
          throw new NotFoundException(errorMessage);
        case status.INVALID_ARGUMENT:
          throw new BadRequestException(errorMessage);
        case status.UNAUTHENTICATED:
          throw new UnauthorizedException(errorMessage);
        case status.PERMISSION_DENIED:
          throw new ForbiddenException(errorMessage);
        case status.ALREADY_EXISTS:
          throw new BadRequestException(errorMessage);
        default:
          throw new InternalServerErrorException(errorMessage);
      }
    }

    // Handle unknown errors
    console.log('[GrpcErrorMapper] Handling unknown error');
    throw new InternalServerErrorException(error.message || 'Internal server error');
  }
} 