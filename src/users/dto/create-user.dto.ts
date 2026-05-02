import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsUniqueEmail } from "../decorators/IsUniqueEmail.decorator";

export class CreateUserDto {
    @IsString()
    @MinLength(3, { message: 'O nome precisa ter 3 ou mais caracteres.' })
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    readonly name!: string;

    @IsEmail({}, { message: 'E-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    @IsUniqueEmail({ message: 'Este e-mail já está sendo utilizado' })
    readonly email!: string;
}