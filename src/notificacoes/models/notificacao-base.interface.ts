import { TipoDestinatario } from "./notificacao.model";

export interface INotificacaoBase {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
  titulo: string;
  mensagem: string;
  status: string;
  formaEnvio: string;
  tipoNotificacao: string;
  destinatario: TipoDestinatario;
  destinatariosEspecificos?: string[];
  arquivoUrl?: string;
  agendadoPara?: Date;
  criadoPor: string;
}
