import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ServiceModule } from './service/service.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
      global: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('nodemail.MAIL_HOST'),
          port: configService.get<number>('nodemail.MAIL_PORT'),
          auth: {
            user: configService.get<string>('nodemail.MAIL_USER'),
            pass: configService.get<string>('nodemail.MAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    OrderModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
