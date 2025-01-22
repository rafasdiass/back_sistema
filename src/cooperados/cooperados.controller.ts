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
  @Roles('admin','comercial')
  @Post('registro')
  async create(@Body() createUserDto: CreateUserDto,@GetUserId() userId: string) {
    return await this.cooperadosService.create(createUserDto,userId);
  }
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin','comercial')
  @Get()
  async findAll(@Request() req:any,@GetUserId() userId: string) {
    
    return await this.cooperadosService.findAll(userId,req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cooperadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperadoDto: UpdateCooperadoDto) {
    return this.cooperadosService.update(+id, updateCooperadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperadosService.remove(+id);
  }
}
