import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'entities/question.entity';
import { AbstractService } from 'modules/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import Logging from 'library/Logging';

@Injectable()
export class QuestionService extends AbstractService<Question> {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {
    super(questionRepository);
  }

  async create(
    courseId: string,
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    try {
      const newQuestion = this.questionRepository.create({
        course: { id: courseId },
        question: createQuestionDto.question,
        answer: createQuestionDto.answer,
      });
      return this.questionRepository.save(newQuestion);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new course.',
      );
    }
  }
}
