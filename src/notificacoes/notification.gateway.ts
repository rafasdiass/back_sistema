import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { TipoDestinatario } from './models/notificacao.model';
import { JwtService } from '@nestjs/jwt';

/**
 * Gateway WebSocket para gerenciamento de notificações.
 * Responsável por conexões, emissão de eventos e segmentação de notificações.
 */
@WebSocketGateway({
  namespace: 'notificacoes', // => /notificacoes
  cors: {
    origin: '*', // Ajuste para restringir a domínios específicos, se necessário.
  },
})
export class NotificacoesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /**
   * Mapeia `SocketID` para `{ role, id }` de cada conexão ativa.
   */
  private socketRoles = new Map<string, { role: string; id: string }>();

  constructor(
    private readonly notificacoesService: NotificacoesService,
    private readonly jwtService: JwtService, // Para decodificar JWT
  ) {}

  /**
   * Método disparado quando um novo cliente se conecta ao WebSocket.
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        console.warn(
          `[NotificacoesGateway] Conexão recusada (Token ausente): ${client.id}`,
        );
        client.disconnect();
        return;
      }

      // Decodifica o token JWT
      const decoded = this.jwtService.verify(token);
      const role = decoded.role;
      const userId = decoded.id;

      console.log(
        `[NotificacoesGateway] Nova conexão: SocketID: ${client.id}, Role: ${role}, UserID: ${userId}`,
      );

      // Armazena os dados do usuário na conexão
      this.socketRoles.set(client.id, { role, id: userId });

      // Adiciona o cliente às salas conforme seu papel (role)
      if (role === 'COOPERADO') {
        client.join('cooperados');
        client.join(`cooperado_${userId}`);
      } else if (role === 'ADMIN') {
        client.join('admins');
        client.join(`admin_${userId}`);
      }
    } catch (error) {
      console.error(
        `[NotificacoesGateway] Erro ao autenticar usuário:`,
        error.message,
      );
      client.disconnect();
    }
  }

  /**
   * Método disparado quando um cliente se desconecta.
   */
  handleDisconnect(client: Socket): void {
    console.log(`[NotificacoesGateway] Desconectado: ${client.id}`);
    this.socketRoles.delete(client.id);
  }

  /**
   * Evento WebSocket para criação de notificações.
   * O frontend pode emitir 'createNotification' para enviar novas notificações.
   */
  @SubscribeMessage('createNotification')
  async handleCreateNotification(
    @MessageBody() dto: CreateNotificacoeDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log(`[NotificacoesGateway] Recebido createNotification:`, dto);

      // Garante que a conexão está autenticada
      const user = this.socketRoles.get(client.id);
      if (!user || !user.role || !user.id) {
        console.warn(
          `[NotificacoesGateway] Tentativa de envio sem autenticação: ${client.id}`,
        );
        return;
      }

      // Cria a notificação usando o serviço
      const newNotification = await this.notificacoesService.create(dto);

      // Emite a notificação para os destinatários corretos
      this.emitByDestination(newNotification);

      return { success: true, notification: newNotification };
    } catch (error) {
      console.error(
        `[NotificacoesGateway] Erro ao criar notificação:`,
        error.message,
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Método público para que OUTRAS camadas (ex.: Controller, ou outro Service)
   * possam enviar notificações via WebSocket após um CRUD ou qualquer evento.
   */
  public broadcastNotification(notificationData: any): void {
    this.emitByDestination(notificationData);
  }

  /**
   * Método responsável por enviar notificações segmentadas com base no destinatário.
   */
  private emitByDestination(notification: any): void {
    const { destinatario, destinatariosEspecificos } = notification;

    switch (destinatario) {
      case TipoDestinatario.ADMIN:
        this.server.to('admins').emit('adminNotification', notification);
        break;

      case TipoDestinatario.TODOS_COOPERADOS:
        this.server
          .to('cooperados')
          .emit('cooperadoNotification', notification);
        break;

      case TipoDestinatario.COOPERADOS_ESPECIFICOS:
        if (Array.isArray(destinatariosEspecificos)) {
          destinatariosEspecificos.forEach((coopId: string) => {
            this.server
              .to(`cooperado_${coopId}`)
              .emit('cooperadoNotification', notification);
          });
        }
        break;

      default:
        console.warn(
          `[NotificacoesGateway] Tipo de destinatário desconhecido. Enviando para todos.`,
        );
        this.server.emit('cooperadoNotification', notification);
        break;
    }
  }
}
