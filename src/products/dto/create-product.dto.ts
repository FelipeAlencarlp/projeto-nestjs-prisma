import { IsString, MinLength, IsNumber, Min, IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3, { message: 'O nome precisa ter 3 caracteres ou mais.' })
    @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
    readonly name!: string;

    @IsNumber()
    @Min(0.01, { message: 'O valor mínimo deve ser 0.01' })
    @IsNotEmpty({ message: 'O preço do produto é obrigatório.' })
    readonly price!: number;
}