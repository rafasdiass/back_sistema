import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';



export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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
}
