import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solving } from 'entities/solving.entity';
import Logging from 'library/Logging';
import { AbstractService } from 'modules/common/abstract.service';
import { Repository } from 'typeorm';
import { SolvingDto } from './dto/solving.dto';

@Injectable()
export class SolvingService extends AbstractService<Solving> {
  constructor(
    @InjectRepository(Solving)
    private readonly solvingRepository: Repository<Solving>,
  ) {
    super(solvingRepository);
  }

  async create(createSolvingDto: SolvingDto): Promise<Solving> {
    try {
      const newGrade = this.solvingRepository.create({
        user: { id: createSolvingDto.user_id },
        course: { id: createSolvingDto.course_id },
        startedAt: new Date(),
      });

      return this.solvingRepository.save(newGrade);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while linking user with course.',
      );
    }
  }

  async restartCourse(restartCourseDto: SolvingDto) {
    const solving = await this.solvingRepository
      .createQueryBuilder('solving')
      .where('solving.user = :uid', { uid: restartCourseDto.user_id })
      .andWhere('solving.course = :cid', { cid: restartCourseDto.course_id })
      .getOne();

    try {
      solving.startedAt = new Date();
      return this.solvingRepository.save(solving);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while restarting the course.',
      );
    }
  }
}
