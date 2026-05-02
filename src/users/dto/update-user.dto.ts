import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @MinLength(3, { message: 'O nome precisa ter 3 ou mais caracteres.' })
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    readonly name!: string;

    @IsEmail({}, { message: 'E-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    readonly email!: string;
}