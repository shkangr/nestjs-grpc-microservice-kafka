import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('DB_HOST');
        const port = configService.getOrThrow<number>('DB_PORT');
        const username = configService.getOrThrow<string>('DB_USERNAME');
        const password = configService.getOrThrow<string>('DB_PASSWORD');
        const database = configService.getOrThrow<string>('DB_DATABASE');

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}
