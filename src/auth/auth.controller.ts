import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.stategy';
import { Roles } from './roles.decorator';
import { GetUserId } from './user.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ROTA PARA LOGIN
  @Post('login')
  async login(@Body() loginUserDto:LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  

}
