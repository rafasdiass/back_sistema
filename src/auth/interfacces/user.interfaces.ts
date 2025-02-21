// src/auth/interfaces/user.interface.ts

/**
 * Interface de usuário, refletindo os campos que o front espera.
 * Ajuste conforme sua tabela no Prisma e se todos os campos são realmente armazenados.
 */
export interface IUserBase {
  /**
   * ID único do usuário (UUID, por exemplo)
   */
  id: string;

  /**
   * CPF usado para login
   */
  cpf: string;

  /**
   * E-mail para comunicação ou recuperação de senha
   */
  email: string;

  /**
   * Papel para controle de acesso
   */
  role: 'ADMIN' | 'COMERCIAL' | 'COOPERADO';

  /**
   * Nome do usuário
   */
  first_name: string;

  /**
   * Sobrenome do usuário
   */
  last_name: string;

  /**
   * Telefone de contato
   */
  phone: string;

  /**
   * Endereço, se armazenado como objeto
   * (verifique como você salva no Prisma; talvez sejam campos separados)
   */
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
  };

  /**
   * Data de registro no sistema
   * Exemplo: '2023-07-25T12:34:56Z'
   */
  registration_date: string;

  /**
   * Indica se o usuário está ativo
   */
  is_active: boolean;

  /**
   * ID do comercial associado (caso seja um cooperado vinculado a um comercial)
   */
  comercialId?: string;

  /**
   * Data de criação do registro no banco
   */
  createdAt: string;

  /**
   * Data da última atualização do registro no banco
   */
  updatedAt: string;

  /**
   * Senha do usuário (pode estar vazia no primeiro login ou omissa ao retornar)
   */
  password?: string;
}
