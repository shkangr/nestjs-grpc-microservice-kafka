import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class NotificationService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'notification-consumer-group',
        allowAutoTopicCreation: true,
      },
      run: {
        autoCommit: true,
      },
    },
  })
  private client: ClientKafka;

  async onModuleInit() {
    await this.client.connect();
    console.log('[notification-service] Connected to Kafka');

    // Verify topic exists
    const admin = this.client.createClient().admin();
    const topics = await admin.listTopics();
    console.log('[notification-service] Topics:', topics);
    if (!topics.includes('user.created')) {
      console.log('[notification-service] Waiting for topic: user.created to be created...');
      // Wait for topic to be created
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Subscribe to topics
    const topicsToSubscribe = ['user.created'];
    topicsToSubscribe.forEach(topic => {
      this.client.subscribeToResponseOf(topic);
    });
    console.log('[notification-service] Subscribed to topics:', topicsToSubscribe);
  }

  async handleUserCreated(data: any) {
    console.log('[notification-service] Service: Received user created event:', data);
    // 여기서 실제로는 이메일을 보내는 로직이 들어갈 수 있습니다
    console.log(`[notification-service] Service: Sending welcome email to user: ${data.email}`);
  }
} 