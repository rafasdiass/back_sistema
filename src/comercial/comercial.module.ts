// src/comercial/comercial.module.ts

import { Module } from '@nestjs/common';
import { ComercialService } from './comercial.service';
import { ComercialController } from './comercial.controller';
import { PrismaService } from 'src/prisma.service';
import { CooperadosService } from 'src/cooperados/cooperados.service';

// IMPORTA O AuthModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule, // Agora o ComercialModule tem acesso ao AuthService e UserRepository
  ],
  controllers: [ComercialController],
  providers: [
    ComercialService,
    PrismaService,
    CooperadosService,
    // REMOVA o AuthService daqui
  ],
})
export class ComercialModule {}
