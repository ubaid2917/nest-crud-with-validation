import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity'

import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';


@Injectable()

export class BookService {
  constructor(@InjectRepository(Book) private readonly bookRepositry: Repository<Book>) { }


  // create service
  create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepositry.create(createBookDto)
    return this.bookRepositry.save(book)
  }

  // find all service
  findAll(): Promise<Book[]> {
    return this.bookRepositry.find();
  }

  // find one service
  async findOne(id: string): Promise<Book | null> {
    return await this.bookRepositry.findOne({
      where: { id },
    });
  }


  // update services
  update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepositry.update(id, updateBookDto);
  }
 
  // delete service
  remove(id: string) {
    return this.bookRepositry.delete(id);
  }
}
