import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsGateway } from './notification/notification.gateway';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService,private readonly notificationsGateway: NotificationsGateway) {}

  @Post('send')
  sendNotification(@Body() body: { message: string }) {
    this.notificationsGateway.sendNotificationToAll(body.message);
    return { success: true, message: 'Notificação enviada!' };
  }
  



  @Get('pagamentos')
  getHello(): any {
    const mockPagamento = {
      cooperado: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        first_name: "João",
        last_name: "Silva"
      },
      valor: 250.75,
      status: "pendente",
      data: "2025-01-28T15:30:00.000Z", // Data do pagamento no formato ISO
      vencimento: "2025-02-05T23:59:59.000Z" // Data de vencimento no formato ISO
    };

    return mockPagamento;
   
  }
}
