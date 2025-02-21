// src/admin/admin.service.ts

import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { DashboardDto } from './dto/dashboard.dto';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { ComercialService } from 'src/comercial/comercial.service';
import { Configuracoes } from './dto/configs.interface';

@Injectable()
export class AdminService {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly cooperadosService: CooperadosService,
    private readonly comercialService: ComercialService,
  ) {}

  async create(createAdminDto: CreateAdminDto, userId: string) {
    const role = 'admin';
    return this.authService.create(createAdminDto, userId, role);
  }

  async report(userId: string): Promise<DashboardDto> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id: userId },
    });
    if (!admin) {
      throw new Error('User not found');
    }

    const cooperados = await this.prismaService.cooperado.count();
    const comerciais = await this.prismaService.comercial.count();
    const cooperadosAtivos = await this.prismaService.cooperado.count({
      where: { is_active: true },
    });
    const historicoPagamentos = [
      { nome: 'Fulano da Silva', valor: 200 },
      { nome: 'Ciclano Pereira', valor: 100 },
    ];

    return {
      nome: admin.first_name + ' ' + admin.last_name,
      cpf: admin.cpf,
      historicoPagamentos,
      pagamentosRealizados: 1000,
      pagamentosPendentes: 1000,
      pagamentosCancelados: 1000,
      totalCooperados: cooperados,
      totalComercial: comerciais,
      cooperadosAtivos,
    };
  }

  async dashboard(userId: string): Promise<DashboardDto> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id: userId },
    });
    if (!admin) {
      throw new Error('User not found');
    }

    const cooperados = await this.prismaService.cooperado.count();
    const comerciais = await this.prismaService.comercial.count();
    const cooperadosAtivos = await this.prismaService.cooperado.count({
      where: { is_active: true },
    });
    const historicoPagamentos = [
      { nome: 'Fulano da Silva', valor: 200 },
      { nome: 'Ciclano Pereira', valor: 100 },
    ];

    return {
      nome: admin.first_name + ' ' + admin.last_name,
      cpf: admin.cpf,
      historicoPagamentos,
      pagamentosRealizados: 1000,
      pagamentosPendentes: 1000,
      pagamentosCancelados: 1000,
      totalCooperados: cooperados,
      totalComercial: comerciais,
      cooperadosAtivos,
    };
  }

  async findAll(): Promise<any> {
    const users = await Promise.all([
      this.prismaService.cooperado.findMany(),
      this.prismaService.admin.findMany(),
      this.prismaService.comercial.findMany(),
    ]);
    return users;
  }

  async findAllDeactivate(userId: string, role: string): Promise<any> {
    try {
      return await this.cooperadosService.findAllDeactivate(userId, role);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateStatus(id: string, status: boolean) {
    try {
      await this.cooperadosService.updateStatus(id, status);
      return { message: 'Status updated' };
    } catch (error) {
      return { message: 'Error updating status' };
    }
  }

  // == Cooperado
  async removeCooperado(id: string, userId: string) {
    return this.cooperadosService.remove(id, userId);
  }

  async updateCooperado(
    id: string,
    updateAdminDto: UpdateAdminDto,
    userId: string,
  ) {
    return this.cooperadosService.update(id, updateAdminDto, userId);
  }

  async findAllCooperado(userId: string, role?: string) {
    return this.cooperadosService.findAll(userId, 'admin');
  }

  async finOneCooperado(id: string) {
    return this.cooperadosService.findOne(id);
  }

  async createCooperado(createAdminDto: CreateAdminDto, userId: string) {
    return this.cooperadosService.create(createAdminDto, userId);
  }

  async findAllDeactivateCooperado(userId: string, role: string) {
    return this.cooperadosService.findAllDeactivate(userId, role);
  }

  // == Comercial
  async createComercial(createAdminDto: CreateAdminDto, userId: string) {
    return this.comercialService.create(createAdminDto, userId);
  }

  async removeComercial(id: string, userId: string) {
    return this.comercialService.remove(id, userId);
  }

  async updateComercial(
    id: string,
    updateAdminDto: UpdateAdminDto,
    userId: string,
  ) {
    return this.comercialService.update(id, updateAdminDto, userId);
  }

  async findOneComercial(id: string, userId: string) {
    return this.comercialService.findOne(id);
  }

  async findAllComercial(userId: string) {
    return this.comercialService.findAll();
  }

  // == Exemplos
  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  findAllPagamentos(userId: string) {
    throw new Error('Method not implemented.');
  }
}
