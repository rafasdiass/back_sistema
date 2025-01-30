import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateComercialDto } from './dto/create-comercial.dto';
import { UpdateComercialDto } from './dto/update-comercial.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { stat } from 'fs';
import { first } from 'rxjs';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { CreateUserDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class ComercialService {
  
  
  
  async createCooperado(createCooperadoDto: CreateUserDto, userId: string) {
    
    await this.cooperadosService.create(createCooperadoDto,userId)
  }
  
 

  constructor (private authService:AuthService,private prismaService:PrismaService, private cooperadosService:CooperadosService){}


  async dashboard(userId: string) {
    const admin = await this.prismaService.comercial.findUnique({
      where: {
        id: userId
      }
    });

    // verifica se o usuario admin existe
    if (!admin) {
      throw new Error('User not found');
    }

    // busca a quantidade de cooperados
    const cooperados = await this.prismaService.cooperado.count();

    // busca a quantidade de comerciais
    const comerciais = await this.prismaService.comercial.count();

    // busca a quantidade de cooperados ativos  
    const cooperadosAtivos = await this.prismaService.cooperado.count({
      where: {
        is_active: true
      }
    });

    //mockar historico de pagamentos

    const historicoPagamentos = [
      { "nome": "Fulano da Silva", "valor": 200 },
    { "nome": "Ciclano Pereira", "valor": 100 }
      
    ];

    //

    return {
      totalPropostas: 10,
      propostasPendentes: 5,
      historicoPropostas: [
        {
          data: '2021-10-01', 
          valor: 100,
          status: 'aprovado',
          cliente: 'Fulano da Silva'
        },
        {
          data: '2021-10-02', 
          valor: 200,
          status: 'reprovado',
          cliente: 'Ciclano Pereira'
        },
        {
          data: '2021-10-03', 
          valor: 300,
          status: 'aprovado',
          cliente: 'Beltrano da Silva'
        }
      ]
       
      };

    
  }
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
          email: true,
          cpf: true
        }
      });
      // retorna o id, nome e email dos comerciais

      return comerciais.map(comercial => {
        return {
          id: comercial.id,
          first_name: comercial.first_name,
          last_name: comercial.last_name,
          cpf: comercial.cpf,
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

  async findAllCooperados(userId: string,role: string) {

    const cooperados = this.cooperadosService.findAll(userId,role);

   
    return cooperados;



  }
}
