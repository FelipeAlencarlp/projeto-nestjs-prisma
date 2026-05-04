import {
    IsNumber,
    IsNotEmpty,
    IsPositive,
    IsArray,
    ArrayNotEmpty,
    ArrayMinSize
} from "class-validator";

export class CreateOrderDto {
    @IsNumber({}, { message: 'O ID precisa ser número.' })
    @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
    @IsPositive({ message: 'O ID tem que ser maior que 0.' })
    readonly userId!: number;

    @IsArray({ message: 'Precisa ser passado um Array.' })
    @ArrayNotEmpty({ message: 'O Array não pode ser vazio.' })
    @ArrayMinSize(1, { message: 'É preciso pelo menos um ID de produto.' })
    @IsNumber({}, { each: true, message: 'O ID precisa ser número' })
    readonly productIds!: number[];
}