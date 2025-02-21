import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CooperadosModule } from './cooperados/cooperados.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ComercialModule } from './comercial/comercial.module';
import { AdminModule } from './admin/admin.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configuração global do ambiente
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configuração global do Passport
    JwtModule.registerAsync({
      global: true, // Agora está disponível globalmente
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    AuthModule,
    CooperadosModule,
    ComercialModule,
    AdminModule,
    NotificacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
