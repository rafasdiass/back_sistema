// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ResumoController } from './resumo.controller';
import { PrismaService } from 'src/prisma.service';
import { ComercialService } from 'src/comercial/comercial.service';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { AuthModule } from 'src/auth/auth.module';
import { AdminConfigsService } from './admin-configs.service';

// ESTE É O PASSO IMPORTANTE
import { NotificacoesModule } from 'src/notificacoes/notificacoes.module';

@Module({
  imports: [
    AuthModule, // se AdminService usa AuthService
    NotificacoesModule, // se AdminController injeta NotificacoesGateway
  ],
  controllers: [AdminController, ResumoController],
  providers: [
    AdminService,
    AdminConfigsService,
    PrismaService,
    ComercialService,
    CooperadosService,
  ],
})
export class AdminModule {}
