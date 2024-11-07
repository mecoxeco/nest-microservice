import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URI')],
        queue: this.configService.get<string>('RABBITMQ_QUEUE'),
        queueOptions: { durable: true },
      },
    });
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async sendMessage(pattern: string, data: any) {
    return this.client.send(pattern, data).toPromise();
  }
}
