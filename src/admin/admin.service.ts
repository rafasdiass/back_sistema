import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { DashboardDto } from './dto/dashboard.dto';
import { CooperadosService } from 'src/cooperados/cooperados.service';
import { Configuracoes } from './dto/configs.interface';
import { ComercialService } from 'src/comercial/comercial.service';

@Injectable()
export class AdminService {
  
  

  constructor (private authService:AuthService, private prismaService:PrismaService,private cooperadosService:CooperadosService,private comercialService:ComercialService){}

  async create(createAdminDto: CreateAdminDto, userId: string) {

    const role = 'admin';
    return await this.authService.create(createAdminDto,userId,role);
  }

  async report(userId: string): Promise<DashboardDto> {

    // busca o usuario admin no banco de dados

    const admin = await this.prismaService.admin.findUnique({
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
      nome: admin.first_name + ' ' + admin.last_name,
      cpf: admin.cpf,
      historicoPagamentos,
      pagamentosRealizados: 1000,
      pagamentosPendentes: 1000,
      pagamentosCancelados: 1000,
      totalCooperados: cooperados,
      totalComercial: comerciais,
      cooperadosAtivos: cooperadosAtivos
    }
  }
  async dashboard(userId: string): Promise<DashboardDto> {

    // busca o usuario admin no banco de dados

    const admin = await this.prismaService.admin.findUnique({
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
      nome: admin.first_name + ' ' + admin.last_name,
      cpf: admin.cpf,
      historicoPagamentos,
      pagamentosRealizados: 1000,
      pagamentosPendentes: 1000,
      pagamentosCancelados: 1000,
      totalCooperados: cooperados,
      totalComercial: comerciais,
      cooperadosAtivos: cooperadosAtivos
    }
  }
  async findAll() : Promise<any>{

    const  users = await Promise.all([
      this.prismaService.cooperado.findMany(),
      this.prismaService.admin.findMany(),
      this.prismaService.comercial.findMany(),
    ]);

    return users;



  }


  async findAllDeactivate(userId: string, role: string): Promise<any> {

    try {

      await this.cooperadosService.findAllDeactivate(userId, role);



    } catch (error) {
      
    }

  }


  async getConfigs(configs: any, userId: string): Promise<any> {

    configs = await this.prismaService.configs.findMany();

    configs = configs[0]

    //retorna as configs sem o id do banco de dados
   
    return {
      ...configs,
      id: undefined
    }
    
    
  }

  async updateConfigs(configs: any, userId: string): Promise<any> {
    
    configs = await this.prismaService.configs.findMany();
    
    try {
      configs = await this.prismaService.configs.update({
        where: {
          id: configs.id
        },
        data: {
          ...configs,
        }
      });

      return configs;

    } catch (error) {
      return {
        message: 'Error saving configs'
      }
      
    }
  }


  async updateStatus(id: string, status: boolean) {

    try {
      await this.cooperadosService.updateStatus(id, status);
  
      return {
        message: 'Status updated'
      }
    } catch (error) {
      return {
        message: 'Error updating status'
      }
      
    }
  }





 


  //FUNCTIONS PARA COMERCIAIS
  async createComercial(createAdminDto: CreateAdminDto, userId: string) {
    await this.comercialService.create(createAdminDto,userId);
  }
  async removeComercial(id: string, userId: string) {
    await this.comercialService.remove(id,userId);
  }
  async updateComercial(id: string, updateAdminDto: UpdateAdminDto, userId: string) {
    await this.comercialService.update(id,updateAdminDto,userId);
  }

  async findOneComercial(id: string, userId: string) {
    return await this.comercialService.findOne(id);
  }
  
  async findAllComercial(userId: string) {
    
    return await this.comercialService.findAll();
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
