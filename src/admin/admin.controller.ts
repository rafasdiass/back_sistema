import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.stategy';
import { Roles } from 'src/auth/roles.decorator';
import { GetUserId } from 'src/auth/user.decorator';
import { CooperadosService } from 'src/cooperados/cooperados.service';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,private cooperadosService:CooperadosService) {}

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN')
  @Post('registro')
  async createAdmin(@Body() createAdmindto: CreateAdminDto,@GetUserId() userId: string) {
    return await this.adminService.create(createAdmindto,userId);
  }

  // ROTA PARA VALIDAR USUÁRIO
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN')
  @Patch('validate/:id')
  async validateUser(@Param('id') id: string) {
    return await this.cooperadosService.updateStatus(id, true); // Sempre ativa
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN')
  @Get('validate')
  async validateUsers(@Request() req:any,@GetUserId() userId: string) {
      
      return await this.cooperadosService.findAllDeactivate(userId,req.user.role);
    }
  // ROTA PARA DESATIVAR USUÁRIO
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN')
  @Patch('invalidate/:id')
  async invalidateUser(@Param('id') id: string) {
    return await this.cooperadosService.updateStatus(id, false); // Sempre desativa
  }


  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN')
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
}
