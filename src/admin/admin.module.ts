import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { ComercialService } from 'src/comercial/comercial.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,PrismaService,AuthService,CooperadosService,ComercialService],
})
export class AdminModule {}
