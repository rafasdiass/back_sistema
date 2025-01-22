import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtStrategy],
})
export class AuthModule {}
