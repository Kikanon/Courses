import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'entities/course.entity';
import { Question } from 'entities/question.entity';
import { QuestionModule } from 'modules/question/question.module';
import { SolvingModule } from 'modules/solving/solving.module';
import { GradeModule } from 'modules/grade/grade.module';

@Module({
  imports: [
    QuestionModule,
    SolvingModule,
    GradeModule,
    TypeOrmModule.forFeature([Course, Question]),
  ],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
