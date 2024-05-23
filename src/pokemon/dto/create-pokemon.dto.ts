import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {


    @IsInt()
    @IsPositive({ message: 'Debe ser positivo' })
    @Min(1, {message: 'Debe ser mayor a 1'})
    no: number;


    @IsString()
    @MinLength(3)
    name: string;


}
