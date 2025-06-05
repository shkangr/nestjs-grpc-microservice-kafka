import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { protobufPackage } from '../../shared/proto/ts/user';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: join(process.cwd(), 'shared/proto/user.proto'),
        url: '0.0.0.0:5000',
      },
    },
  );
  await app.listen();
  console.log('gRPC User Service is running on port 5000');
}
bootstrap();
