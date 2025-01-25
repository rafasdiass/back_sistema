import { PartialType } from '@nestjs/mapped-types';
import { CreateComercialDto } from './create-comercial.dto';
import { UpdateAdminDto } from 'src/admin/dto/update-admin.dto';

export class UpdateComercialDto extends (UpdateAdminDto) {}
