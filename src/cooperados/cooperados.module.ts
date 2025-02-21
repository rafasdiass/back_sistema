import { Module } from '@nestjs/common';
import { CooperadosService } from './cooperados.service';
import { CooperadosController } from './cooperados.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { NotificacoesModule } from 'src/notificacoes/notificacoes.module'; // Agora importamos o módulo completo

@Module({
  imports: [AuthModule, NotificacoesModule], // ✅ Importamos o módulo de notificações
  controllers: [CooperadosController],
  providers: [CooperadosService, PrismaService, AuthService],
  exports: [CooperadosService], // Exporta para outros módulos, se necessário
})
export class CooperadosModule {}
