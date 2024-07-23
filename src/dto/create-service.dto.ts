import { IsDecimal, IsNotEmpty, IsPositive, isString, IsString, MaxLength } from "class-validator";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsPositive()
    @IsNotEmpty()
    price: number;
}
