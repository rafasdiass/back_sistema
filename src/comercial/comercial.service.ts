import { Injectable } from '@nestjs/common';
import { CreateComercialDto } from './dto/create-comercial.dto';
import { UpdateComercialDto } from './dto/update-comercial.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ComercialService {

  constructor (private authService:AuthService,private prismaService:PrismaService){}

  async create(createComercialDto: CreateComercialDto,userId: string) {
    
    const role = 'comercial';
    
    await this.authService.create(createComercialDto,userId,role);
    
  }

  async findAll() {

    try {
      return await this.prismaService.comercial.findMany();
    }
    catch (error) {
      return error;
    }



  }

  async findOne(id: string) {
    try

    {
      return await this.prismaService.comercial.findUnique({
        where: {
          id: id
        }
      });
    }
    catch (error) {
      return error;
    }






  }

  async update(id: string, updateComercialDto: UpdateComercialDto) {
    
    try {
      return await this.prismaService.comercial.update({
        where: {
          id: id
        },
        data: updateComercialDto
      });
    }
    catch (error) {
      return error;
    }

  }

  async remove(id: string) {
    
    try {
      return await this.prismaService.comercial.delete({
        where: {
          id: id
        }
      });
    }
    catch (error) {
      return error;
    }

  }
}
