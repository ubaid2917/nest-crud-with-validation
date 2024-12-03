import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  // create the post
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createBookDto: CreateBookDto) {
    const result = await this.bookService.create(createBookDto);

    return {
      status: HttpStatus.CREATED,
      msg: 'Book created successfully',
      data: result ? result : null,
    };
  }

  // get all 

  @Get()
  async findAll() {
    const data = await this.bookService.findAll();
    if (data) {
      return {
        status: HttpStatus.FOUND,
        msg: 'Books retrived successfully',
        data: data,
      };
    }
  }

  // get by id
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return {
      status: HttpStatus.FOUND,
      msg: 'Book found successfully',
      data: book,
    };
  }


  // update the update
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    await this.bookService.update(id, updateBookDto);
    const result = await this.bookService.findOne(id);
    console.log('result', result);

    return {
      status: HttpStatus.OK,
      msg: 'Book updated successfully',
      data: result,
    };
  }


  // delete with id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isExistBook = await this.bookService.findOne(id);
    if (isExistBook) {
      const result = this.bookService.remove(id);
      return { status: HttpStatus.OK, msg: 'Book deleted successfully' };
    }
    return { status: HttpStatus.NOT_FOUND, msg: 'Book not found' };
  }
}
