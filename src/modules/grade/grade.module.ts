import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { Grade } from 'entities/grade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeController } from './grade.controller';
import { SolvingModule } from 'modules/solving/solving.module';
import { QuestionModule } from 'modules/question/question.module';

@Module({
  imports: [SolvingModule, QuestionModule, TypeOrmModule.forFeature([Grade])],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
