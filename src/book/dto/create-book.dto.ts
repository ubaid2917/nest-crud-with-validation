import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookDto {

    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsOptional()
    description: string;
}
