import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserRequest } from '../../../shared/proto/ts/user';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class UserService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user-producer',
        brokers: ['localhost:9092'],
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })
  private client: ClientKafka;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.client.connect();
    console.log('[grpc-user] Connected to Kafka');

    // Create topic if not exists
    const admin = this.client.createClient().admin();
    const topics = await admin.listTopics();
    console.log('[grpc-user] Topics:', topics);
    if (!topics.includes('user.created')) {
      await admin.createTopics({
        topics: [{
          topic: 'user.created',
          numPartitions: 1,
          replicationFactor: 1
        }]
      });
      console.log('[grpc-user] Created topic: user.created');
    }
  }

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
    const savedUser = await this.usersRepository.save(user);
    console.log('[grpc-user] Service: User created:', savedUser);
    
    try {
      // Publish user.created event with delivery report
      const message = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        createdAt: savedUser.createdAt
      };
      
      console.log('[grpc-user] Publishing message to Kafka:', message);
      
      // Use send() instead of emit() to get delivery report
      const result = await this.client.createClient().producer.send({
        topic: 'user.created',
        messages: [{
          value: JSON.stringify(message)
        }]
      });
      
      console.log('[grpc-user] Raw delivery result:', result);
      
      // Log each record's details
      result.forEach((record, index) => {
        console.log(`[grpc-user] Message ${index} delivery details:`, {
          topicName: record.topicName,
          partition: record.partition,
          baseOffset: record.baseOffset,
          timestamp: record.timestamp
        });
      });
      
      console.log('[grpc-user] Service: User created event published successfully');
    } catch (error) {
      console.error('[grpc-user] Failed to publish message to Kafka:', error);
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        details: 'Failed to publish user created event',
        message: 'KAFKA_PUBLISH_ERROR'
      });
    }

    return savedUser;
  }
} 