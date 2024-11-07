import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.listenForMessages();
  }

  private async listenForMessages() {
    const connection = await amqp.connect(this.configService.get<string>('RABBITMQ_URI'));
    const channel = await connection.createChannel();
    const queue = this.configService.get<string>('RABBITMQ_QUEUE');

    await channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      (message) => {
        if (message) {
          const content = message.content.toString();
          console.log('Mensagem recebida:', content);

          channel.ack(message);
        }
      },
      { noAck: false },
    );
  }
}
