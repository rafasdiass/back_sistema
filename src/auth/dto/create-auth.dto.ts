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
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
  };

  
}
