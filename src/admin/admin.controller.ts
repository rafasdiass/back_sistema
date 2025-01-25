import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.stategy';
import { Roles } from 'src/auth/roles.decorator';
import { GetUserId } from 'src/auth/user.decorator';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { Configuracoes } from './dto/configs.interface';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  
  @Post('registro')
  async createAdmin(@Body() createAdmindto: CreateAdminDto,@GetUserId() userId: string) {
    return await this.adminService.create(createAdmindto,userId);
  }

  // ROTA PARA VALIDAR USUÁRIO
  
  @Patch('validate/:id')
  async validateUser(@Param('id') id: string) {
    return await this.adminService.updateStatus(id, true); // Sempre ativa
  }

  
  @Get('validate')
  async validateUsers(@Request() req:any,@GetUserId() userId: string) {
      
      return await this.adminService.findAllDeactivate(userId,req.user.role);
    }
  // ROTA PARA DESATIVAR USUÁRIO
  
  @Patch('invalidate/:id')
  async invalidateUser(@Param('id') id: string) {
    return await this.adminService.updateStatus(id, false); // Sempre desativa
  }

  
  @Get('config-system')
  async getConfigs(@Body() configs:Configuracoes,@GetUserId() userId: string) {
    return await this.adminService.getConfigs(configs,userId); // Sempre desativa
  }

  
  @Put('config-system')
  async updateConfigs(@Body() configs:Configuracoes,@GetUserId() userId: string) {
    return await this.adminService.updateConfigs(configs,userId); // Sempre desativa
  }

  
  @Get('dashboard')
  async dashboard(@GetUserId() userId: string) {
    return await this.adminService.dashboard(userId); 
  }

  
  @Get('report')
  async report(@GetUserId() userId: string) {
    return await this.adminService.report(userId); 
  }

  // ROTAS PARA COMERCIAIS
  
  @Get('comerciais')
  async findAllComercial(@GetUserId() userId: string) {
   
    return await this.adminService.findAllComercial(userId);
  }

  
  @Post('comerciais')
  async createComercial(@Body() createAdminDto: CreateAdminDto,@GetUserId() userId: string) {

    return await this.adminService.createComercial(createAdminDto,userId);
  }

  
  @Get('comerciais/:id')
  async findOneComercial(@Param('id') id: string,@GetUserId() userId: string) {
    return await this.adminService.findOneComercial(id,userId);
  }

  
  @Put('comerciais/:id')
  async updateComercial(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto,@GetUserId() userId: string) {
    return await this.adminService.updateComercial(id, updateAdminDto,userId);
  }

  
  @Delete('comerciais/:id')
  async removeComercial(@Param('id') id: string,@GetUserId() userId: string) {
    return await this.adminService.removeComercial(id,userId);
  }
  
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  

  // ROTAS PARA COOPERADOS
}
