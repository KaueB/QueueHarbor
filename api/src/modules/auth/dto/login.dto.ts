import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  email: string;

  @IsNotEmpty({ message: 'A palavra-passe é obrigatória.' })
  @MinLength(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' })
  password: string;
}