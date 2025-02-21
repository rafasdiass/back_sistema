import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificacoeDto } from './create-notificacoe.dto';
import { IsUUID } from 'class-validator';

export class UpdateNotificacoeDto extends PartialType(CreateNotificacoeDto) {
  @IsUUID()
  id: string;
}
