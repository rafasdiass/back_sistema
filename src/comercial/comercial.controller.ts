import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComercialService } from './comercial.service';
import { CreateComercialDto } from './dto/create-comercial.dto';
import { UpdateComercialDto } from './dto/update-comercial.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.stategy';
import { CreateUserDto } from 'src/auth/dto/create-auth.dto';
import { GetUserId } from 'src/auth/user.decorator';

@Controller('comercial')
export class ComercialController {
  constructor(private readonly comercialService: ComercialService) {}

  //ROTA PARA CRIAR COMERCIAL
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin')
  @Post('registro')
  async createComercial(@Body() createUserDto: CreateUserDto,@GetUserId() userId: string) {
      return await this.comercialService.create(createUserDto,userId);
    }
  
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin') 
  @Get()
  findAll() {
    return this.comercialService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comercialService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComercialDto: UpdateComercialDto) {
    return this.comercialService.update(id, updateComercialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comercialService.remove(id);
  }
}
