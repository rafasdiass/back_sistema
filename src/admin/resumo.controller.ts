import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GetUserId } from 'src/auth/user.decorator';

import { Configuracoes } from './dto/configs.interface';
import { ComercialService } from 'src/comercial/comercial.service';


@Controller('resumo')
@UseGuards(AuthGuard('jwt'),RolesGuard)
//@Roles('ADMIN')
export class ResumoController {
  constructor(private readonly adminService: AdminService,private readonly comercialService: ComercialService) {}

  @Roles('COMERCIAL')
  @Get('comercial')
  async dashboardComercial(@GetUserId() userId: string) {
    console.log('chegou aqui');
    return await this.comercialService.dashboard(userId); 
  }
  
  @Get('admin')
  async dashboard(@GetUserId() userId: string) {
    console.log('chegou aqui');
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
  
  // ROTAS PARA COOPERADOS


  @Get('cooperados')
  async findAllCooperado(@GetUserId() userId: string) {
    
    return await this.adminService.findAllCooperado(userId);
  }

  @Post('cooperados')
  async createCooperado(@Body() createAdminDto: CreateAdminDto,@GetUserId() userId: string) {
     console.log('chegou aqui');
    return await this.adminService.createCooperado(createAdminDto,userId);
  }

  @Get('cooperados/:id')
  async findOneCooperado(@Param('id') id: string,@GetUserId() userId: string) {
    return await this.adminService.finOneCooperado(id);
  }

  @Put('cooperados/:id')
  async updateCooperado(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto,@GetUserId() userId: string) {
    return await this.adminService.updateCooperado(id, updateAdminDto,userId);
  }


  @Delete('cooperados/:id')
  async removeCooperado(@Param('id') id: string,@GetUserId() userId: string) {
    return await this.adminService.removeCooperado(id,userId);
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

  

  
}
