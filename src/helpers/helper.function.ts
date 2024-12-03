import { CreateUserDto } from "src/user/dto/create-user.dto"
import { UserService } from '../user/user.service'
import {
    HttpStatus,
    HttpException,
} from '@nestjs/common';

export const checkDuplicateUser = async (createUserDto: CreateUserDto, userService: UserService): Promise<void> => {
    const { email, number } = createUserDto;
    
    // find by email
    const isExistUserEmail = await userService.findByEmail(email);
    if (isExistUserEmail) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
 
    // find by number
    const isExistUserNumber = await userService.findByNumber(number);
    if (isExistUserNumber) {
        throw new HttpException('Phone number already exists', HttpStatus.CONFLICT);
    }
}