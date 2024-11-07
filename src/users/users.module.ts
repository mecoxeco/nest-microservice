import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RmqModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
