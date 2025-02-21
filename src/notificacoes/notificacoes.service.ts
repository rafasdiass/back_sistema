import { Injectable } from '@nestjs/common';
import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { UpdateNotificacoeDto } from './dto/update-notificacoe.dto';
import { NotificacoesRepository } from './notificacoes.repository';
import { NotificacaoEntity } from './entities/notificacoe.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificacoesService {
  constructor(
    private readonly notificacoesRepository: NotificacoesRepository,
  ) {}

  // Criar notificação via factory method
  create(createNotificacoeDto: CreateNotificacoeDto): NotificacaoEntity {
    const entity = NotificacaoEntity.fromCreateDto(
      createNotificacoeDto,
      uuidv4(),
    );
    return this.notificacoesRepository.create(entity);
  }

  findAll(): NotificacaoEntity[] {
    return this.notificacoesRepository.findAll();
  }

  findAdminNotifications(): NotificacaoEntity[] {
    return this.notificacoesRepository.findAdminNotifications();
  }

  findOne(id: string): NotificacaoEntity | { error: string } {
    const notif = this.notificacoesRepository.findOne(id);
    if (!notif) {
      return { error: `Notificação com ID ${id} não encontrada.` };
    }
    return notif;
  }

  update(
    id: string,
    dto: UpdateNotificacoeDto,
  ): NotificacaoEntity | { error: string } {
    const existing = this.notificacoesRepository.findOne(id);
    if (!existing) {
      return { error: `Notificação com ID ${id} não encontrada.` };
    }
    existing.updateFromDto(dto);
    return existing;
  }

  remove(id: string): NotificacaoEntity | { error: string } {
    const removed = this.notificacoesRepository.remove(id);
    if (!removed) {
      return { error: `Notificação com ID ${id} não encontrada.` };
    }
    return removed;
  }
}
