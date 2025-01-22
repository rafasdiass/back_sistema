import { Module } from '@nestjs/common';
import { ComercialService } from './comercial.service';
import { ComercialController } from './comercial.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ComercialController],
  providers: [ComercialService,PrismaService,AuthService],
})
export class ComercialModule {}
