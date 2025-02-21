import { Injectable } from '@nestjs/common';
import { NotificacaoEntity } from './entities/notificacoe.entity';

@Injectable()
export class NotificacoesRepository {
  private notificacoes: NotificacaoEntity[] = [];

  create(notificacao: NotificacaoEntity): NotificacaoEntity {
    this.notificacoes.push(notificacao);
    return notificacao;
  }

  findAll(): NotificacaoEntity[] {
    return this.notificacoes;
  }

  findAdminNotifications(): NotificacaoEntity[] {
    return this.notificacoes.filter((notif) => notif.destinatario === 'ADMIN');
  }

  findOne(id: string): NotificacaoEntity | null {
    return this.notificacoes.find((notif) => notif.id === id) || null;
  }

  remove(id: string): NotificacaoEntity | null {
    const index = this.notificacoes.findIndex((n) => n.id === id);
    if (index === -1) return null;

    return this.notificacoes.splice(index, 1)[0];
  }
}
