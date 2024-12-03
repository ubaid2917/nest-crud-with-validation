import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepositry: Repository<User>) { }


  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepositry.create(createUserDto)
    return this.userRepositry.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepositry.find();
  }

  findOne(id: string) {
    return this.userRepositry.findOne({ where: { id } });
  } 


  // find by email 
  findByEmail(email: string){
    return this.userRepositry.findOneBy({ email: email });
  }  

  // find by number 
  findByNumber(number: string){
    return this.userRepositry.findOneBy({ number: number });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepositry.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepositry.delete(id);
  }   



}
