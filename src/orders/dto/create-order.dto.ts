import { IsNumber, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
    @IsPositive({ message: 'O ID tem que ser maior que 0.' })
    readonly id!: number;

    @IsNumber()
    @IsNotEmpty({ message: 'É preciso ao menos um ID de produto.' })
    @IsPositive({ message: 'O ID tem que ser maior que 0.' })
    readonly productIds!: number[];
}