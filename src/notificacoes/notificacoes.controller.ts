import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { UpdateNotificacoeDto } from './dto/update-notificacoe.dto';
import { NotificacoesGateway } from './notification.gateway';

@Controller('notificacoes')
export class NotificacoesController {
  constructor(
    private readonly notificacoesService: NotificacoesService,
    private readonly notificacoesGateway: NotificacoesGateway,
  ) {}

  /**
   * Cria uma nova notificação via REST (POST /notificacoes).
   * Após criar, emite a notificação para os clientes conectados via WebSocket.
   */
  @Post()
  create(@Body() createNotificacoeDto: CreateNotificacoeDto) {
    const newNotification =
      this.notificacoesService.create(createNotificacoeDto);

    // Emite para os clientes WebSocket
    this.notificacoesGateway.broadcastNotification(newNotification);

    return newNotification;
  }

  /**
   * Retorna TODAS as notificações armazenadas (GET /notificacoes).
   */
  @Get()
  findAll() {
    return this.notificacoesService.findAll();
  }

  /**
   * Retorna APENAS as notificações destinadas a 'ADMIN' (GET /notificacoes/admin).
   * Você pode ajustar a lógica no serviço para filtrar corretamente.
   */
  @Get('admin')
  findAdminNotifications() {
    return this.notificacoesService.findAdminNotifications();
  }

  /**
   * Retorna UMA notificação específica (GET /notificacoes/:id).
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacoesService.findOne(id);
  }

  /**
   * Atualiza uma notificação existente (PATCH /notificacoes/:id).
   * Se a notificação for encontrada e atualizada com sucesso,
   * emite a notificação atualizada para os clientes via WebSocket.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificacoeDto: UpdateNotificacoeDto,
  ) {
    const updatedNotification = this.notificacoesService.update(
      id,
      updateNotificacoeDto,
    );

    // Se não for um erro, emite via WebSocket
    if (!('error' in updatedNotification)) {
      this.notificacoesGateway.broadcastNotification(updatedNotification);
    }

    return updatedNotification;
  }

  /**
   * Remove uma notificação específica (DELETE /notificacoes/:id).
   * Se a notificação for encontrada e removida, emite um aviso via WebSocket.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    const removedNotification = this.notificacoesService.remove(id);

    // Se não for erro, emite via WebSocket
    if (!('error' in removedNotification)) {
      this.notificacoesGateway.broadcastNotification({
        message: `Notificação de ID ${id} foi removida.`,
        data: removedNotification,
      });
    }

    return removedNotification;
  }
}
