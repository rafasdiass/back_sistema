// src/notificacoes/notificacoes.module.ts

import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { NotificacoesGateway } from './notification.gateway';
import { NotificacoesRepository } from './notificacoes.repository';

@Module({
  controllers: [NotificacoesController],
  providers: [NotificacoesService, NotificacoesRepository, NotificacoesGateway],
  exports: [
    NotificacoesGateway, // <-- Precisamos exportar para outro módulo injetar
  ],
})
export class NotificacoesModule {}
