import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: true }) // Permite conexões de outros domínios
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedClients = new Set<Socket>();
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
      this.connectedClients.add(client);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
      this.connectedClients.delete(client);
    }
  
    /**
     * 🔹 Teste: Enviar notificação e escutar no próprio backend
     */
    sendNotificationToAll(message: string) {
      console.log('Enviando notificação:', message);
      
      // Emitindo o evento para todos os clientes conectados
      this.server.emit('adminNotification', { message });
  
      // Chamando manualmente a função que escuta, para testar no backend
      this.handleNotificationTest({ message });
    }
  
    /**
     * 🔹 Escutando o evento "adminNotification" no próprio backend
     */
    @SubscribeMessage('adminNotification')
    handleNotificationTest(@MessageBody() data: any) {
      console.log('Notificação recebida dentro do próprio backend:', data);
    }
  }
  