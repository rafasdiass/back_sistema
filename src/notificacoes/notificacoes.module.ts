import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { NotificacoesGateway } from './notification.gateway'; // Ajustei o nome do arquivo
import { NotificacoesRepository } from './notificacoes.repository';

@Module({
  controllers: [NotificacoesController],
  providers: [NotificacoesService, NotificacoesRepository, NotificacoesGateway],
  exports: [
    NotificacoesService, // ✅ Exportamos para ser usado por outros módulos
    NotificacoesGateway, // ✅ Exportamos para que possa ser injetado no `CooperadosService`
  ],
})
export class NotificacoesModule {}
