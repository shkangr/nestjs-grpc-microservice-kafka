import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any) {
    console.log('[notification-service] Controller: Received user created event:', data);
    await this.notificationService.handleUserCreated(data);
  }
} 