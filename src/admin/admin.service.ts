import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {

  constructor (private authService:AuthService, private prismaService:PrismaService){}

  async create(createAdminDto: CreateAdminDto, userId: string) {

    const role = 'admin';
    return await this.authService.create(createAdminDto,userId,role);
  }

  
  async findAll() {

    const  users = await Promise.all([
      this.prismaService.cooperado.findMany(),
      this.prismaService.admin.findMany(),
      this.prismaService.comercial.findMany(),
    ]);

    return users;



  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
