import { TipoDestinatario } from "../models/notificacao.model";
import { IsString, IsOptional, IsEnum, IsDate, IsArray } from 'class-validator';

export class CreateNotificacoeDto {
  @IsString()
  titulo: string;

  @IsString()
  mensagem: string;

  @IsString()
  status: string;

  @IsString()
  formaEnvio: string;

  @IsString()
  tipoNotificacao: string;

  @IsEnum(TipoDestinatario)
  destinatario: TipoDestinatario;

  @IsOptional()
  @IsArray()
  destinatariosEspecificos?: string[];

  @IsOptional()
  @IsString()
  arquivoUrl?: string;

  @IsOptional()
  @IsDate()
  agendadoPara?: Date | string;

  @IsString()
  criadoPor: string;
}
