import { IsString, IsNumber, Min, IsNotEmpty, MinLength } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @MinLength(3, { message: 'O nome precisa ter 3 ou mais caracteres.' })
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    readonly name!: string;

    @IsNumber()
    @Min(0.01, { message: 'O valor mínimo deve ser 0.01' })
    @IsNotEmpty({ message: 'O preço é obrigatório.' })
    readonly price!: number;
}