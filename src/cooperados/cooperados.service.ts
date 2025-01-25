import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCooperadoDto } from './dto/create-cooperado.dto';
import { UpdateCooperadoDto } from './dto/update-cooperado.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CooperadosService {

  constructor(private  prismaService: PrismaService,private authService:AuthService) {}


  async create(createCooperadoDto: CreateCooperadoDto,userId: string) {
    
    await this.authService.create(createCooperadoDto,userId,'cooperado');

  }

  async findAll(userId:string, role:string) {
    

    if (role === 'comercial') {
      const  users = await this.prismaService.cooperado.findMany(
        {
          where:{
            comercialId:userId
          },
          select:{
            id:true,
            first_name:true,
            last_name:true,
            email:true,
            phone:true,
            cpf:true,
            is_active:true

          }
        }
      )

      return users.map(user => ({
        
        id: user.id,
        nome: user.first_name + ' ' + user.last_name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        is_active: user.is_active

      }));
    }

    const  users = await this.prismaService.cooperado.findMany(
      {
        select:{
          id:true,
          first_name:true,
          last_name:true,
          email:true,
          phone:true,
          cpf:true,
          is_active:true,
          comercialId:true
        }
      }
    )

    return users.map(user => ({
        id: user.id,
        nome: user.first_name + ' ' + user.last_name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        is_active: user.is_active,
        comercialId: user.comercialId

        
      }));

  }


  async findAllDeactivate(userId:string, role:string):Promise<any> {
    
    
    if (role === 'comercial') {
      const  users = await this.prismaService.cooperado.findMany(
        {
          where:{
            comercialId:userId,
            AND:{
              is_active :false
            }
            
          }
        }
      )

      users.forEach(user => {
        delete user.password;
      });

      return users
    }

    let  users = await this.prismaService.cooperado.findMany()

    //REMOVER A SENHA DOS USUÁRIOS

    return users.map(user => {
    const { password, ...rest } = user; // Remove o campo password
    return rest;
    });



  }

  async findOne(id: string) {
    
    const user = await this.prismaService.cooperado.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return {
      ...user,
      password: undefined,
    }

  }

  async update(id: string, updateCooperadoDto: UpdateCooperadoDto,userId:string) {
    
    const user = await this.prismaService.cooperado.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return await this.prismaService.cooperado.update({
      where: { id },
      data: updateCooperadoDto,
      omit: {
        password: true,
      },
    });







  }

  async remove(id: string,userId:string) {
    

    const user = await this.prismaService.cooperado.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return await this.prismaService.cooperado.delete({
      where: {
        id,
      },
    });






    
  }

  async updateStatus(id: string, arg: boolean) {

    const user = await this.prismaService.cooperado.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }
    if (user.is_active === arg) {
      throw new ConflictException('Status already set');
    }

     // Atualiza o status do usuário E retorna o usuário atualizado SEM A SENHA

    return await this.prismaService.cooperado.update({
      where: { id },
      data: {
        is_active: arg,
      },
      omit: {
       
        password: true,
      },  
    });



  }
  
}
