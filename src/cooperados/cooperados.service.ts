import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCooperadoDto } from './dto/create-cooperado.dto';
import { UpdateCooperadoDto } from './dto/update-cooperado.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';
import { NotificacoesGateway } from 'src/notificacoes/notification.gateway';
import { CreateNotificacoeDto } from 'src/notificacoes/dto/create-notificacoe.dto';

@Injectable()
export class CooperadosService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
    private notificacoesService: NotificacoesService,
    private notificacoesGateway: NotificacoesGateway,
  ) {}

  async create(createCooperadoDto: CreateCooperadoDto, userId: string) {
    const newCooperado = await this.authService.create(
      createCooperadoDto,
      userId,
      'cooperado',
    );

    // 🔥 Criar e salvar a notificação
    const notificacao = this.notificacoesService.create({
      mensagem: `📢 Um novo cooperado foi cadastrado: ${createCooperadoDto.first_name} ${createCooperadoDto.last_name}!`,
      destinatario: 'TODOS_COOPERADOS',
    } as CreateNotificacoeDto);

    // 🔥 Enviar via WebSocket
    this.notificacoesGateway.broadcastNotification(notificacao);

    return newCooperado;
  }

  async findAll(userId: string, role: string) {
    let users;

    if (role === 'comercial') {
      users = await this.prismaService.cooperado.findMany({
        where: { comercialId: userId },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          cpf: true,
          is_active: true,
          address: true,
        },
      });
    } else {
      users = await this.prismaService.cooperado.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          cpf: true,
          is_active: true,
          comercialId: true,
          address: true,
        },
      });
    }

    return users;
  }

  async findAllDeactivate(userId: string, role: string) {
    let users;

    if (role === 'comercial') {
      users = await this.prismaService.cooperado.findMany({
        where: { comercialId: userId, is_active: false },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          cpf: true,
          is_active: true,
          address: true,
        },
      });
    } else {
      users = await this.prismaService.cooperado.findMany({
        where: { is_active: false },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          cpf: true,
          is_active: true,
          comercialId: true,
          address: true,
        },
      });
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.prismaService.cooperado.findFirst({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    const { password, ...rest } = user;
    return rest;
  }

  async update(
    id: string,
    updateCooperadoDto: UpdateCooperadoDto,
    userId: string,
  ) {
    const user = await this.prismaService.cooperado.findFirst({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    const updatedUser = await this.prismaService.cooperado.update({
      where: { id },
      data: updateCooperadoDto,
    });

    // 🔥 Criar e salvar a notificação
    const notificacao = this.notificacoesService.create({
      mensagem: `📢 Dados do cooperado ${updatedUser.first_name} ${updatedUser.last_name} foram atualizados.`,
      destinatario: 'COOPERADOS_ESPECIFICOS',
      destinatariosEspecificos: [id],
    } as CreateNotificacoeDto);

    // 🔥 Enviar via WebSocket
    this.notificacoesGateway.broadcastNotification(notificacao);

    return updatedUser;
  }

  async remove(id: string, userId: string) {
    const user = await this.prismaService.cooperado.findFirst({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    await this.prismaService.cooperado.delete({ where: { id } });

    // 🔥 Criar e salvar a notificação
    const notificacao = this.notificacoesService.create({
      mensagem: `⚠️ O cooperado ${user.first_name} ${user.last_name} foi removido.`,
      destinatario: 'COOPERADOS_ESPECIFICOS',
      destinatariosEspecificos: [id],
    } as CreateNotificacoeDto);

    // 🔥 Enviar via WebSocket
    this.notificacoesGateway.broadcastNotification(notificacao);

    return { message: 'Cooperado removido com sucesso' };
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.prismaService.cooperado.findFirst({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }
    if (user.is_active === isActive) {
      throw new ConflictException('Status already set');
    }

    const updatedUser = await this.prismaService.cooperado.update({
      where: { id },
      data: { is_active: isActive },
    });

    // 🔥 Criar e salvar a notificação
    const notificacao = this.notificacoesService.create({
      mensagem: `🟢 O status do cooperado ${updatedUser.first_name} ${updatedUser.last_name} foi atualizado.`,
      destinatario: 'COOPERADOS_ESPECIFICOS',
      destinatariosEspecificos: [id],
    } as CreateNotificacoeDto);

    // 🔥 Enviar via WebSocket
    this.notificacoesGateway.broadcastNotification(notificacao);

    return updatedUser;
  }
}
