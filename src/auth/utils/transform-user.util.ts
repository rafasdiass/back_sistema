// src/auth/utils/transform-user.util.ts

import { IUserBase } from '../interfacces/user.interfaces';

export function transformDbUserToIUserBase(dbUser: any): IUserBase {
  // Converte datas para string
  const createdAtStr =
    dbUser.createdAt instanceof Date
      ? dbUser.createdAt.toISOString()
      : String(dbUser.createdAt);

  const updatedAtStr =
    dbUser.updatedAt instanceof Date
      ? dbUser.updatedAt.toISOString()
      : String(dbUser.updatedAt);

  const registrationDateStr =
    dbUser.registration_date instanceof Date
      ? dbUser.registration_date.toISOString()
      : String(dbUser.registration_date);

  // Se address é JSON (dbUser.address), tentamos parse se for string
  let addressObj: IUserBase['address'] | undefined;
  if (dbUser.address) {
    // Se for string, parse. Se for objeto, assume que é do tipo certo.
    if (typeof dbUser.address === 'string') {
      try {
        addressObj = JSON.parse(dbUser.address);
      } catch {
        addressObj = undefined;
      }
    } else if (typeof dbUser.address === 'object') {
      addressObj = dbUser.address;
    }
  }

  const user: IUserBase = {
    id: dbUser.id,
    cpf: dbUser.cpf,
    email: dbUser.email,
    role: dbUser.role, // 'COOPERADO', 'COMERCIAL' ou 'ADMIN'
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    phone: dbUser.phone,
    address: addressObj,
    registration_date: registrationDateStr,
    is_active: dbUser.is_active,
    comercialId: dbUser.comercialId, // se não existir em cooperado/admin, vem undefined
    createdAt: createdAtStr,
    updatedAt: updatedAtStr,
    password: dbUser.password,
  };

  return user;
}
