
import { IsEmail, IsString , IsNumber, IsNotEmpty, IsEnum} from 'class-validator';
export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    number: string;

    @IsEnum(['user' , 'admin'], {message: 'Role is either user or admin'}) 
    role: 'user' | 'admin';
}
