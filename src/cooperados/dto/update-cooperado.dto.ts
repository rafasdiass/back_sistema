import { PartialType } from '@nestjs/mapped-types';
import { CreateCooperadoDto } from './create-cooperado.dto';

export class UpdateCooperadoDto extends PartialType(CreateCooperadoDto) {}
