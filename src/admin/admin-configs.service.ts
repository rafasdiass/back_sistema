// src/admin/admin-configs.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

/**
 * Serviço responsável apenas pelas Configurações do sistema,
 * removendo essa lógica do AdminService para seguir SRP.
 */
@Injectable()
export class AdminConfigsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Retorna as configurações do sistema.
   */
  async getConfigs(): Promise<any> {
    const foundConfigs = await this.prismaService.configs.findMany();
    if (!foundConfigs.length) {
      throw new NotFoundException('Nenhuma configuração encontrada.');
    }
    const cfg = foundConfigs[0];
    return {
      ...cfg,
      id: undefined, // Se quiser ocultar o ID
    };
  }

  /**
   * Atualiza as configurações do sistema.
   */
  async updateConfigs(updatedData: any): Promise<any> {
    const found = await this.prismaService.configs.findMany();
    if (!found.length) {
      throw new NotFoundException('Configurações não encontradas.');
    }

    const configDb = found[0];
    const updated = await this.prismaService.configs.update({
      where: { id: configDb.id },
      data: {
        ...configDb,
        ...updatedData,
      },
    });
    return updated;
  }
}
