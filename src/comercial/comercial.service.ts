import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

      const comerciais = await this.prismaService.comercial.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true
        }
      });
      // retorna o id, nome e email dos comerciais

      return comerciais.map(comercial => {
        return {
          id: comercial.id,
          name: comercial.first_name + ' ' + comercial.last_name,
          email: comercial.email
        }
      }
      );



    } catch (error) {
      
      return error;
    }

   


  }

  async findOne(id: string) {
  
      const comercial = await this.prismaService.comercial.findUnique({
        where: {
          id: id
        }
      });
      
      if (!comercial) {
        throw new NotFoundException(`Comercial with ID ${id} not found`);
      }
      return {...comercial,
        password: undefined
      };



  }

  async update(id: string, updateComercialDto: UpdateComercialDto,userId: string) {

    const comercial = await this.findOne(id); 

    if (!comercial) {
      throw new Error(`Comercial with ID ${id} not found`);
    }
    
    try {
      return await this.prismaService.comercial.update({
        where: {
          id: id
        },
        data: {
          ...updateComercialDto,
          
        }
      });
    }
    catch (error) {
      return error;
    }

    
  }

  async remove(id: string,userId: string) {
    
    const comercial = await this.findOne(id); 

    console.log(comercial);
    try {
      return await this.prismaService.comercial.delete({
        where: {
          id: id
        }
      });
    }
    catch (error) {
      throw new Error(`Error deleting Comercial with ID ${id}: ${error.message}`);
    
    }




  }
}
