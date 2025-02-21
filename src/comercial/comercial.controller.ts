import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ComercialService } from './comercial.service';
import { CreateComercialDto } from './dto/create-comercial.dto';
import { UpdateComercialDto } from './dto/update-comercial.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateUserDto } from 'src/auth/dto/create-auth.dto';
import { GetUserId } from 'src/auth/user.decorator';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Roles('COMERCIAL','ADMIN')
@Controller('comercial')
export class ComercialController {
  constructor(private readonly comercialService: ComercialService , ) {}

  //ROTA PARA CRIAR COMERCIAL
  //@Roles('COMERCIAL')
  @Get('dashboard')
  async dashboard(@GetUserId() userId: string) {
    console.log(userId);
    return await this.comercialService.dashboard(userId); 
  }
  @Post()
  async createComercial(@Body() createUserDto: CreateUserDto,@GetUserId() userId: string) {
      return await this.comercialService.create(createUserDto,userId);
    }
  
 
  @Get()
  findAll() {
    return this.comercialService.findAll();
  }

  @Get('cooperados')
  findAllCooperados(@Request() req:any,@GetUserId() userId: string) {
    return this.comercialService.findAllCooperados(userId,req.user.role);
  }


  @Post('cooperados')
  async createCooperados(@Body() createCooperadoDto:CreateUserDto,@GetUserId() userId: string){
    return this.comercialService.createCooperado(createCooperadoDto,userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comercialService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComercialDto: UpdateComercialDto,@GetUserId() userId: string) {
    return this.comercialService.update(id, updateComercialDto,userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@GetUserId() userId: string) {
    return this.comercialService.remove(id,userId);
  } 
 


}
