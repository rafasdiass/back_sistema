import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';


export class LoginUserDto {
 
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF must have 11 digits.' })
  cpf: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must be at least 6 characters long and include both letters and numbers.',
  })
  password: string;

  
}
