import { Module, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { ComercialService } from 'src/comercial/comercial.service';
import { ResumoController } from './resumo.controller';

@Module({
  controllers: [AdminController,ResumoController],
  providers: [AdminService,PrismaService,AuthService,CooperadosService,ComercialService],
})
export class AdminModule {}
