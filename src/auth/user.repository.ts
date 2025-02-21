// src/auth/user.repository.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { IUserBase } from './interfacces/user.interfaces';
import * as bcrypt from 'bcrypt';
import { transformDbUserToIUserBase } from './utils/transform-user.util';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByCpfOrEmail(
    cpf: string,
    email?: string,
  ): Promise<{ user: IUserBase; table: string } | null> {
    // 1) Tenta cooperado
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });
    if (cooperado) {
      return {
        user: transformDbUserToIUserBase(cooperado),
        table: 'cooperado',
      };
    }

    // 2) Tenta admin
    const admin = await this.prisma.admin.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });
    if (admin) {
      return {
        user: transformDbUserToIUserBase(admin),
        table: 'admin',
      };
    }

    // 3) Tenta comercial
    const comercial = await this.prisma.comercial.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });
    if (comercial) {
      return {
        user: transformDbUserToIUserBase(comercial),
        table: 'comercial',
      };
    }

    // 4) Não encontrou
    return null;
  }

  async updatePassword(cpf: string, newPassword: string): Promise<IUserBase> {
    const found = await this.findUserByCpfOrEmail(cpf);
    if (!found) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let dbUser: any;
    switch (found.table) {
      case 'cooperado':
        dbUser = await this.prisma.cooperado.update({
          where: { cpf },
          data: { password: hashedPassword },
        });
        break;
      case 'admin':
        dbUser = await this.prisma.admin.update({
          where: { cpf },
          data: { password: hashedPassword },
        });
        break;
      case 'comercial':
        dbUser = await this.prisma.comercial.update({
          where: { cpf },
          data: { password: hashedPassword },
        });
        break;
      default:
        throw new BadRequestException('Cannot update password for this table');
    }

    return transformDbUserToIUserBase(dbUser);
  }

  async createUser(role: string, data: Partial<IUserBase>): Promise<IUserBase> {
    const roleUpper = role.toUpperCase();

    // 1) Se address for object, converter para string para prisma
    let addressJson: any;
    if (data.address) {
      addressJson = JSON.stringify(data.address);
    }

    // 2) Monta objeto base. *Removemos* campos que não existem na tabela
    // Por exemplo, cooperado não tem 'comercialId' (a menos que seu schema tenha).
    // Ajuste conforme a real estrutura do seu prisma.
    const createData: any = {
      cpf: data.cpf, // *obrigatório* no schema
      email: data.email, // idem
      role: roleUpper, // 'COOPERADO', 'COMERCIAL', 'ADMIN'
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      address: addressJson,
      // 'registration_date', 'is_active', 'password' etc. se quiser setar custom
      password: data.password ?? '', // se quiser default
    };

    // Exemplo: se no front mandar `comercialId`, mas no schema cooperado não tiver esse campo, precisamos omitir
    // if (roleUpper === 'COOPERADO' && data.comercialId) {
    //   createData.comercialId = data.comercialId; // SÓ se cooperado tiver comercialId no schema
    // }

    let dbUser: any;
    switch (roleUpper) {
      case 'COOPERADO':
        dbUser = await this.prisma.cooperado.create({
          data: createData,
        });
        break;
      case 'COMERCIAL':
        dbUser = await this.prisma.comercial.create({
          data: createData,
        });
        break;
      case 'ADMIN':
        dbUser = await this.prisma.admin.create({
          data: createData,
        });
        break;
      default:
        throw new BadRequestException('Invalid role');
    }

    return transformDbUserToIUserBase(dbUser);
  }

  async checkUserConflict(cpf: string, email?: string): Promise<void> {
    const found = await this.findUserByCpfOrEmail(cpf, email);
    if (found) {
      throw new ConflictException('User already exists');
    }
  }
}
