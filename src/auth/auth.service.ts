import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { find } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { cp } from 'fs';
@Injectable()
export class AuthService {
  
  

  constructor(private  prismaService: PrismaService,
  private jwtService: JwtService,
  ) {}

  async createPassword(createPasswordDto:LoginUserDto) {

    const {cpf,password} = createPasswordDto
    
    try {
      // Verifica primeiro se o usuário existe em alguma das tabelas
      const user = await this.prismaService.cooperado.findFirst({
        where: { cpf },
      }) || await this.prismaService.comercial.findFirst({
        where: { cpf },
      });

      // Se não encontrou o usuário em nenhuma tabela, lança erro
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Gera o hash da nova senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Decide qual tabela atualizar com base na existência de comercialId
      if (user.hasOwnProperty('comercialId')) { 
        await this.prismaService.cooperado.update({
          where: { cpf },
          data: { password: hashedPassword },
        });
      } else {
        await this.prismaService.comercial.update({
          where: { cpf },
          data: { password: hashedPassword },
        });
      }

      return { message: 'Password updated successfully' };

    } catch (error) {
      throw new BadRequestException('Error updating password');
    }
   
    
  }

  async create(createUserDto: CreateUserDto, userId: string, role: string) {
    
    const {first_name, last_name,phone, email, cpf, address } = createUserDto;
    
    // Verifica se o usuário já existe
    const userAlreadyExists = await this.findByCpfOrEmail(cpf, email);
    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }
  
    // Hash seguro da senha
   
    
    // Mapeamento de funções de criação com base no role
    const roleMap = {
      cooperado: () =>
        this.prismaService.cooperado.create({
          data: {
            first_name,
            last_name,
            email,
            password: '',
            role: 'COOPERADO',
            cpf,
            phone,
            comercialId: userId,
            address

          },
        }),
      comercial: () =>
        this.prismaService.comercial.create({
          data: {
            first_name,
            last_name,
            email,
            password: '',
            role: 'COMERCIAL',
            cpf,
            phone,
            address

          },

        }),
      admin: () =>
        this.prismaService.admin.create({
          data: {
            first_name,
            last_name,
            email,
            password: '',
            role: 'ADMIN',
            cpf,
            phone,
            address
          },
        }),
    };
  
    // Verifica se o role é válido
    if (!roleMap[role]) {
      throw new BadRequestException('Invalid role');
    }
  
    // Executa a função de criação correspondente ao role
    const createUser = await roleMap[role]();
  
    // Retorna o usuário criado sem expor a senha
    return { ...createUser, password: undefined };
  }
  
  async findAll() {
    
    const  users = await Promise.all([
      this.prismaService.cooperado.findMany(),
      this.prismaService.admin.findMany(),
      this.prismaService.comercial.findMany(),
    ]);

    return users;
  }

  async findOne(id: string) {
    
    const user = await this.prismaService.cooperado.findUnique({
      where: {
        id,
      },
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: string) {
    return `This action removes a #${id} auth`;
  }

  async login(loginUserDto: LoginUserDto) {
    const { cpf, password } = loginUserDto;
  
    // Verifica se o usuário existe
    const user = await this.findByCpfOrEmail(cpf);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    // Verifica se a senha está correta
    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Gera o payload com base no role do usuário
    const payload = this.createPayload(user);
    
    // Retorna o token JWT
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, password: undefined },
    };
  }
  
  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  
  private createPayload(user: any): Record<string, any> {
    const basePayload = {
      id: user.id,
      role: user.role,
    };
  
    // Adiciona atributos específicos com base no role
    switch (user.role) {
      case 'admin':
        if ('isAdmin' in user) {
          return { ...basePayload, isAdmin: user.isAdmin };
        }
        break;
  
      case 'comercial':
        return basePayload;
  
      default:
        return basePayload;
    }
  }
  
  async findByCpfOrEmail(cpf: string,email?: string, ) {
    
    // busca usuarios nas tabelas user,admin e comercial

    const user = await Promise.all([
      this.prismaService.cooperado.findFirst({
        where: {
          OR: [
            { email },
            { cpf },
          ],
        },
      }),
      this.prismaService.admin.findFirst({
        where: {
          OR: [
            { email },
            { cpf },
          ],
        },
      }),
      this.prismaService.comercial.findFirst({
        where: {
          OR: [
            { email },
            { cpf },
          ],
        },
      }),
    ]);
    
    // Filtra os resultados para encontrar o primeiro registro não nulo
    const foundUser = user.find((u) => u !== null);
   
    return foundUser;
  }


  
}
