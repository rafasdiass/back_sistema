import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { TipoDestinatario } from './models/notificacao.model';

/**
 * O NotificacoesGateway fica responsável pela comunicação via WebSocket,
 * permitindo que o backend envie notificações aos clientes conectados
 * (cooperados, administradores, etc.) de forma segmentada, usando rooms.
 *
 * Responsabilidade Única (SRP):
 * - Este Gateway gerencia as conexões (conexão/disconexão) e roteia eventos
 *   (ex.: 'createNotification').
 * - A lógica de criação/atualização de notificações fica no NotificacoesService.
 * - A definição de repositórios/dados fica em outro lugar (respeitando SOLID).
 */
@WebSocketGateway({
  namespace: 'notificacoes', // => /notificacoes
  cors: {
    origin: '*', // Ajuste caso queira restringir a domínios específicos.
  },
})
export class NotificacoesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /**
   * Armazena informações de cada socket conectado:
   * - 'role': Se é 'ADMIN', 'COOPERADO' etc.
   * - 'id': Identificador do usuário (ex.: 'cooperado_001', 'admin_123')
   */
  private socketRoles = new Map<string, { role: string; id: string }>();

  constructor(private readonly notificacoesService: NotificacoesService) {}

  /**
   * Método disparado quando um novo client se conecta ao WebSocket.
   * Aqui configuramos salas específicas para cada tipo (ADMIN, COOPERADO),
   * permitindo emitir eventos de forma segmentada.
   */
  handleConnection(client: Socket): void {
    const { role, id } = client.handshake.query;

    console.log(
      '[NotificacoesGateway] Nova conexão:',
      'SocketID:',
      client.id,
      'Role:',
      role,
      'UserID:',
      id,
    );

    // Armazena os dados para referência rápida
    this.socketRoles.set(client.id, {
      role: (role as string) || '',
      id: (id as string) || '',
    });

    // Se for cooperado, entra nas salas 'cooperados' e 'cooperado_<id>'
    if (role === 'COOPERADO') {
      client.join('cooperados');
      if (id) {
        client.join(`cooperado_${id}`);
      }
    }
    // Se for admin, entra nas salas 'admins' e 'admin_<id>'
    else if (role === 'ADMIN') {
      client.join('admins');
      if (id) {
        client.join(`admin_${id}`);
      }
    }
  }

  /**
   * Método disparado quando um cliente se desconecta.
   * Aqui removemos o registro do socket, se necessário.
   */
  handleDisconnect(client: Socket): void {
    console.log('[NotificacoesGateway] Desconexão:', client.id);
    this.socketRoles.delete(client.id);
  }

  /**
   * Exemplo de evento vindo do front-end.
   * Se o front emitir 'createNotification' com dados do CreateNotificacoeDto,
   * criamos a notificação (via NotificacoesService) e emitimos de acordo
   * com o tipo de destinatário (admin, cooperados, etc.).
   */
  @SubscribeMessage('createNotification')
  handleCreateNotification(@MessageBody() dto: CreateNotificacoeDto) {
    console.log('[NotificacoesGateway] Evento createNotification:', dto);

    // 1. Cria a notificação via Service (lógica de negócio e persistência)
    const newNotification = this.notificacoesService.create(dto);

    // 2. Emite a notificação para as salas corretas, baseado no tipoDestinatario
    this.emitByDestination(newNotification);

    // 3. Retorno opcional para o cliente que originou o evento
    return newNotification;
  }

  /**
   * Método público para que OUTRAS camadas (ex.: Controller, ou outro Service)
   * possam enviar notificações via WebSocket após um CRUD ou qualquer evento.
   */
  public broadcastNotification(notificationData: any): void {
    this.emitByDestination(notificationData);
  }

  /**
   * Método central de roteamento de notificação,
   * que verifica o tipo de destinatário e emite somente para as salas relevantes.
   */
  private emitByDestination(notification: any): void {
    const { destinatario, destinatariosEspecificos } = notification;

    switch (destinatario) {
      /**
       * Emite somente para admins
       */
      case TipoDestinatario.ADMIN:
        this.server.to('admins').emit('adminNotification', notification);
        break;

      /**
       * Emite para todos cooperados
       */
      case TipoDestinatario.TODOS_COOPERADOS:
        this.server
          .to('cooperados')
          .emit('cooperadoNotification', notification);
        break;

      /**
       * Emite para cooperados específicos, ex.: ['cooperado_001','cooperado_002']
       * Cada cooperado fica na sala 'cooperado_cooperado_001', etc.
       */
      case TipoDestinatario.COOPERADOS_ESPECIFICOS:
        if (Array.isArray(destinatariosEspecificos)) {
          destinatariosEspecificos.forEach((coopId: string) => {
            this.server
              .to(`cooperado_${coopId}`)
              .emit('cooperadoNotification', notification);
          });
        }
        break;

      /**
       * Caso não se encaixe nos tipos acima,
       * envia para todos (opcional)
       */
      default:
        console.warn(
          '[NotificacoesGateway] Tipo de destinatário não reconhecido. Enviando para todos.',
        );
        this.server.emit('cooperadoNotification', notification);
        break;
    }
  }
}
