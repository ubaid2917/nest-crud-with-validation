import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkDuplicateUser } from '../helpers/helper.function';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // create the user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // check email exist or not
    await checkDuplicateUser(createUserDto, this.userService);

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const data = await this.userService.create(createUserDto);
    const { password, ...userWithoutPassword } = data;
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: userWithoutPassword,
    };
  }

  // find all usrs
  @Get()
  async findAll() {
    try {
      const user = await this.userService.findAll();

      const newUser = user.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      );

      return {
        status: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: newUser,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while retrieving users',
        error,
      };
    }
  }

  // find by id
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const user = await this.userService.findOne(id);
      const { password, ...userWithoutPassword } = user;
      return {
        status: 200,
        message: 'User retrieved successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { status: 404, message: error.message };
      }
      throw error;
    }
  }

  // update the user
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const currentUser = await this.userService.findOne(id);

      if (updateUserDto && updateUserDto.email !== currentUser.email) {
        const isEmailExist = await this.userService.findByEmail(
          updateUserDto.email,
        );
        if (isEmailExist) {
          return {
            status: HttpStatus.CONFLICT,
            msg: 'Email already exists',
          };
        }
      }

      if (updateUserDto && updateUserDto.number !== currentUser.number) {
        const isNumberExist = await this.userService.findByNumber(
          updateUserDto.number,
        );
        if (isNumberExist) {
          return {
            status: HttpStatus.CONFLICT,
            msg: 'Number already exists',
          };
        }
      }
      await this.userService.update(id, updateUserDto);

      const result = await this.userService.findOne(id);

      return {
        status: HttpStatus.OK,
        msg: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  // delete the user
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isExistUser = await this.userService.findOne(id);
    if (isExistUser) {
      const result = this.userService.remove(id);
      return { status: HttpStatus.OK, msg: 'user deleted successfully' };
    }
    return { status: HttpStatus.NOT_FOUND, msg: 'user not found' };
  }
}
