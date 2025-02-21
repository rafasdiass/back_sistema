import { INotificacaoBase } from '../models/notificacao-base.interface';
import { TipoDestinatario } from '../models/notificacao.model';
import { CreateNotificacoeDto } from '../dto/create-notificacoe.dto';
import { UpdateNotificacoeDto } from '../dto/update-notificacoe.dto';

export class NotificacaoEntity implements INotificacaoBase {
  public readonly id: string;
  public readonly criadoEm: Date;
  public atualizadoEm: Date;
  public titulo: string;
  public mensagem: string;
  public status: string;
  public formaEnvio: string;
  public tipoNotificacao: string;
  public destinatario: TipoDestinatario;
  public destinatariosEspecificos?: string[];
  public arquivoUrl?: string;
  public agendadoPara?: Date;
  public criadoPor: string;

  /**
   * Construtor privado para obrigar uso dos factories
   */
  private constructor(
    data: Omit<INotificacaoBase, 'id' | 'criadoEm' | 'atualizadoEm'>,
    id: string,
  ) {
    this.id = id;
    this.criadoEm = new Date();
    this.atualizadoEm = new Date();
    Object.assign(this, data);
  }

  /**
   * Factory para criar a entidade a partir do CreateNotificacoeDto
   * Faz a conversão de `agendadoPara` para Date se vier como string
   */
  public static fromCreateDto(
    dto: CreateNotificacoeDto,
    generatedId: string,
  ): NotificacaoEntity {
    // Converte agendadoPara para Date, se vier string
    const agendado = dto.agendadoPara
      ? new Date(dto.agendadoPara) // se vier string, Date() converte
      : undefined;

    return new NotificacaoEntity(
      {
        ...dto,
        agendadoPara: agendado,
      },
      generatedId,
    );
  }

  /**
   * Método de instância para atualizar a entidade a partir do UpdateNotificacoeDto
   */
  public updateFromDto(dto: UpdateNotificacoeDto): void {
    if (dto.agendadoPara) {
      // Converte caso seja string
      this.agendadoPara = new Date(dto.agendadoPara);
    }
    // Copia os demais campos
    if (dto.titulo !== undefined) this.titulo = dto.titulo;
    if (dto.mensagem !== undefined) this.mensagem = dto.mensagem;
    if (dto.status !== undefined) this.status = dto.status;
    if (dto.formaEnvio !== undefined) this.formaEnvio = dto.formaEnvio;
    if (dto.tipoNotificacao !== undefined)
      this.tipoNotificacao = dto.tipoNotificacao;
    if (dto.destinatario !== undefined) this.destinatario = dto.destinatario;
    if (dto.destinatariosEspecificos !== undefined) {
      this.destinatariosEspecificos = dto.destinatariosEspecificos;
    }
    if (dto.arquivoUrl !== undefined) this.arquivoUrl = dto.arquivoUrl;
    if (dto.criadoPor !== undefined) this.criadoPor = dto.criadoPor;

    this.atualizadoEm = new Date();
  }
}
