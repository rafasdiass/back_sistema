// src/admin/admin.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminConfigsService } from './admin-configs.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GetUserId } from 'src/auth/user.decorator';
import { Configuracoes } from './dto/configs.interface';
import { NotificacoesGateway } from 'src/notificacoes/notification.gateway';
import { AuthenticatedRequest } from 'src/auth/interfacces/authenticated-request.interface';
import { NotificationPayload } from 'src/notificacoes/interfaces/notification-payload.interface';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminConfigsService: AdminConfigsService,
    private readonly notificacoesGateway: NotificacoesGateway,
  ) {}

  // =========================
  //       CONFIGURAÇÕES
  // =========================

  @Get('config-system')
  async getConfigs(@GetUserId() userId: string): Promise<unknown> {
    const response = await this.adminConfigsService.getConfigs();
    // Opcional: notificar algo
    return response;
  }

  @Put('config-system')
  async updateConfigs(
    @Body() configs: Configuracoes,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const updated = await this.adminConfigsService.updateConfigs(configs);
    const payload: NotificationPayload = {
      message: 'Configurações do sistema atualizadas!',
      data: updated,
    };
    this.notificacoesGateway.broadcastNotification(payload);
    return updated;
  }

  // =========================
  //        COMERCIAL
  // =========================

  @Post('comerciais')
  async createComercial(
    @Body() createAdminDto: CreateAdminDto,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const comercial = await this.adminService.createComercial(
      createAdminDto,
      userId,
    );
    const payload: NotificationPayload = {
      message: 'Um novo Comercial foi criado!',
      data: comercial,
    };
    this.notificacoesGateway.broadcastNotification(payload);
    return comercial;
  }

  @Get('comerciais')
  async findAllComercial(@GetUserId() userId: string): Promise<unknown> {
    return this.adminService.findAllComercial(userId);
  }

  @Get('comerciais/:id')
  async findOneComercial(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    return this.adminService.findOneComercial(id, userId);
  }

  @Put('comerciais/:id')
  async updateComercial(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const updatedComercial = await this.adminService.updateComercial(
      id,
      updateAdminDto,
      userId,
    );
    if (updatedComercial) {
      const payload: NotificationPayload = {
        message: `Comercial de ID ${id} foi atualizado`,
        data: updatedComercial,
      };
      this.notificacoesGateway.broadcastNotification(payload);
    }
    return updatedComercial;
  }

  @Delete('comerciais/:id')
  async removeComercial(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const removed = await this.adminService.removeComercial(id, userId);
    if (removed) {
      const payload: NotificationPayload = {
        message: `Comercial ID ${id} foi removido`,
        data: removed,
      };
      this.notificacoesGateway.broadcastNotification(payload);
    }
    return removed;
  }

  // =========================
  //     ADMIN / REPORT
  // =========================

  @Post('registro')
  async createAdmin(
    @Body() createAdmindto: CreateAdminDto,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const admin = await this.adminService.create(createAdmindto, userId);
    const payload: NotificationPayload = {
      message: 'Novo Admin registrado!',
      data: admin,
    };
    this.notificacoesGateway.broadcastNotification(payload);
    return admin;
  }

  @Get('admin')
  async dashboard(@GetUserId() userId: string): Promise<unknown> {
    const dash = await this.adminService.dashboard(userId);
    return dash;
  }

  @Get('report')
  async report(@GetUserId() userId: string): Promise<unknown> {
    const rep = await this.adminService.report(userId);
    return rep;
  }

  // =========================
  //    VALIDAÇÃO USUÁRIOS
  // =========================

  @Patch('validate/:id')
  async validateUser(@Param('id') id: string): Promise<unknown> {
    const validated = await this.adminService.updateStatus(id, true);
    if (validated) {
      const payload: NotificationPayload = {
        message: `Usuário ID: ${id} foi validado.`,
        data: validated,
      };
      this.notificacoesGateway.broadcastNotification(payload);
    }
    return validated;
  }

  @Get('validate')
  async validateUsers(
    @Request() req: AuthenticatedRequest,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const users = await this.adminService.findAllDeactivate(
      userId,
      req.user.role,
    );
    return users;
  }

  @Patch('invalidate/:id')
  async invalidateUser(@Param('id') id: string): Promise<unknown> {
    const invalidated = await this.adminService.updateStatus(id, false);
    if (invalidated) {
      const payload: NotificationPayload = {
        message: `Usuário ID: ${id} foi invalidado.`,
        data: invalidated,
      };
      this.notificacoesGateway.broadcastNotification(payload);
    }
    return invalidated;
  }

  // =========================
  //       COOPERADOS
  // =========================

  @Get('cooperados')
  async findAllCooperado(@GetUserId() userId: string): Promise<unknown> {
    return this.adminService.findAllCooperado(userId);
  }

  @Get('pagamentos')
  async findAllPagamentos(@GetUserId() userId: string): Promise<unknown> {
    return this.adminService.findAllPagamentos(userId);
  }

  @Get('cooperados/pendentes')
  async findAllCooperadoPendentes(
    @Request() req: AuthenticatedRequest,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const pendentes = await this.adminService.findAllCooperado(
      userId,
      req.user.role,
    );
    return pendentes;
  }

  @Post('cooperados')
  async createCooperado(
    @Body() createAdminDto: CreateAdminDto,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const cooperado = await this.adminService.createCooperado(
      createAdminDto,
      userId,
    );
    const payload: NotificationPayload = {
      message: 'Novo cooperado criado!',
      data: cooperado,
    };
    this.notificacoesGateway.broadcastNotification(payload);
    return cooperado;
  }

  @Get('cooperados/:id')
  async findOneCooperado(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    return this.adminService.finOneCooperado(id);
  }

  @Put('cooperados/:id')
  async updateCooperado(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const updatedCooperado = await this.adminService.updateCooperado(
      id,
      updateAdminDto,
      userId,
    );
    if (updatedCooperado) {
      const payload: NotificationPayload = {
        message: `Cooperado de ID ${id} atualizado.`,
        data: updatedCooperado,
      };
      this.notificacoesGateway.broadcastNotification(payload);
    }
    return updatedCooperado;
  }

  @Delete('cooperados/:id')
  async removeCooperado(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<unknown> {
    const removed = await this.adminService.removeCooperado(id, userId);
    if (removed) {
      const payload: NotificationPayload = {
        message: `Cooperado ID ${id} foi removido.`,
        data: removed,
      };
      this.notificacoesGateway.broadcastNotification(payload);
    }
    return removed;
  }

  // =========================
  //  ROTAS PADRÃO (CRUD base)
  // =========================

  @Get()
  findAll(): Promise<unknown> {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): unknown {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): unknown {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): unknown {
    return this.adminService.remove(+id);
  }
}
