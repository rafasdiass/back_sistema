import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CooperadosModule } from './cooperados/cooperados.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ComercialModule } from './comercial/comercial.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [AuthModule, PassportModule,ConfigModule.forRoot({ isGlobal: true }), CooperadosModule,
    JwtModule.registerAsync({global:true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ComercialModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
