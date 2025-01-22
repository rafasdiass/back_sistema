import { Module } from '@nestjs/common';
import { CooperadosService } from './cooperados.service';
import { CooperadosController } from './cooperados.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CooperadosController],
  providers: [CooperadosService,PrismaService,AuthService],
})
export class CooperadosModule {}
