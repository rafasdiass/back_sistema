import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { UpdateNotificacoeDto } from './dto/update-notificacoe.dto';

@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Post()
  create(@Body() createNotificacoeDto: CreateNotificacoeDto) {
    return this.notificacoesService.create(createNotificacoeDto);
  }

  @Get()
  findAll() {
    return  {
      id: "123456",
      titulo: "Atualização do Sistema",
      mensagem: "O sistema passará por manutenção programada amanhã às 22h.",
      status: "PENDENTE", // ou "ENVIADA", "FALHA"
      criadoEm: new Date(),
      agendadoPara: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Agendado para 24h depois
      arquivoUrl: "https://example.com/anexo.pdf",
      formaEnvio: "AGENDADO", // ou "IMEDIATO"
      tipoNotificacao: "IMPORTANTE", // ou "INFORMATIVO", "ALERTA"
      atualizadoEm: new Date(),
      destinatario: "COOPERADOS_ESPECIFICOS", // ou "TODOS_COOPERADOS", "INDIVIDUAL"
      destinatariosEspecificos: ["cooperado_001", "cooperado_002"],
      criadoPor: "admin_123"
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificacoeDto: UpdateNotificacoeDto) {
    return this.notificacoesService.update(+id, updateNotificacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacoesService.remove(+id);
  }
}
