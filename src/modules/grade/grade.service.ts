import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from 'entities/grade.entity';
import Logging from 'library/Logging';
import { AbstractService } from 'modules/common/abstract.service';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Question } from 'entities/question.entity';

@Injectable()
export class GradeService extends AbstractService<Grade> {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {
    super(gradeRepository);
  }

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    try {
      const newGrade = this.gradeRepository.create({
        gradeDate: new Date(),
        gradeValue: parseInt(createGradeDto.value),
        user: { id: createGradeDto.userId },
        question: { id: createGradeDto.questionId },
      });
      return this.gradeRepository.save(newGrade);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new grade.',
      );
    }
  }

  async findLatest(
    userId: string,
    questionId: string,
    startDate: Date,
  ): Promise<Grade | null> {
    return await this.gradeRepository
      .createQueryBuilder('grade')
      .where('grade.user=:uid', { uid: userId })
      .andWhere('grade.question=:qid', { qid: questionId })
      .andWhere('grade.gradeDate > :sDate', { sDate: startDate })
      .orderBy('grade.gradeDate', 'DESC')
      .getOne();
  }

  async getGrades(userId: string, questions: Question[], startDate: Date) {
    const questionIds = questions.map((q) => q.id);

    const promises = questionIds.map(async (q) => {
      return await this.findLatest(userId, q, startDate);
    });

    const grades = await Promise.all(promises);

    return grades;
  }
}
