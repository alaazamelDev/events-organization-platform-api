import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AdminModule, UserModule } from '../api';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { JwtConfigModule } from '../config/secrets/jwt/config.module';
import { JwtConfigService } from '../config/secrets/jwt/config.service';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { FileUtilityModule } from '../config/files/utility/file-utility.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [JwtConfigService],
      global: true,
    } as JwtModuleAsyncOptions),
    FileUtilityModule,
    AdminModule,
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    LocalStrategy,
    JwtConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
