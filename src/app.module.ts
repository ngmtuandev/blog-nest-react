import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33061,
      username: 'root',
      password: 'root',
      database: 'blog-nestjs',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    ConfigModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
