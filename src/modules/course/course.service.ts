import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'entities/course.entity';
import { AbstractService } from 'modules/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import Logging from 'library/Logging';

@Injectable()
export class CourseService extends AbstractService<Course> {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {
    super(coursesRepository);
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const newCourse = this.coursesRepository.create({
        author: { id: createCourseDto.author_id },
        title: createCourseDto.title,
      });
      return this.coursesRepository.save(newCourse);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new course.',
      );
    }
  }
}
