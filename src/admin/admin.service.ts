import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { DashboardDto } from './dto/dashboard.dto';

@Injectable()
export class AdminService {
  

  constructor (private authService:AuthService, private prismaService:PrismaService){}

  async create(createAdminDto: CreateAdminDto, userId: string) {

    const role = 'admin';
    return await this.authService.create(createAdminDto,userId,role);
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
      nome: admin.first_name,
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
