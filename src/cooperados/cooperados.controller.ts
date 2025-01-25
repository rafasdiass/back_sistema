import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CooperadosService } from './cooperados.service';
import { CreateCooperadoDto } from './dto/create-cooperado.dto';
import { UpdateCooperadoDto } from './dto/update-cooperado.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.stategy';
import { Roles } from 'src/auth/roles.decorator';
import { GetUserId } from 'src/auth/user.decorator';
import { CreateUserDto } from 'src/auth/dto/create-auth.dto';

@Controller('cooperado')
export class CooperadosController {
  constructor(private readonly cooperadosService: CooperadosService) {}

  //ROTA PARA CRIAR USUÁRIO
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN','COMERCIAL')
  @Post('registro')
  async create(@Body() createUserDto: CreateUserDto,@GetUserId() userId: string) {
    return await this.cooperadosService.create(createUserDto,userId);
  }
  
  // @UseGuards(AuthGuard('jwt'),RolesGuard)
  // @Roles('ADMIN','COMERCIAL')
  // @Get()
  // async findAll(@Request() req:any,@GetUserId() userId: string) {
    
  //   return await this.cooperadosService.findAll(userId,req.user.role);
  // }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('ADMIN','COMERCIAL')
  @Get()
  async findAllDeactivate(@Request() req:any,@GetUserId() userId: string) {
    
    return await this.cooperadosService.findAllDeactivate(userId,req.user.role);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cooperadosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperadoDto: UpdateCooperadoDto,@GetUserId() userId: string) {
    return this.cooperadosService.update(id, updateCooperadoDto,userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@GetUserId() userId: string) {
    return this.cooperadosService.remove(id,userId);
  }
}
