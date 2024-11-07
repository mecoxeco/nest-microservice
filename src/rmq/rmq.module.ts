// rabbitmq/rmq.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqService } from './rmq.service';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  imports: [ConfigModule],
  providers: [RmqService, ConsumerService],
  exports: [RmqService],
})
export class RmqModule {}
