import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  IsBoolean, 
  IsArray, 
  IsEnum, 
  IsOptional, 
  IsObject, 
  ValidateNested, 
  Matches, 
  MinLength 
} from 'class-validator';
import { Type } from 'class-transformer';



class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Postal code must be in the format XXXXX-XXX.' })
  postal_code: string;
}

export class CreateUserDto {
  
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;


  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must be at least 6 characters long and include both letters and numbers.',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF must have 11 digits.' })
  cpf: string;

  @IsNotEmpty()
  //TELEFONE PODE TER DE 10 A 17 DIGITOS
  @Matches(/^\+?[0-9\s\-()]{10,20}$/, { 
    message: 'Phone number must have 10 to 20 digits, and may include +, spaces, -, or parentheses.' 
  })
  phone: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  
}
