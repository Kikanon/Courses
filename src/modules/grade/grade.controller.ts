import {
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { GradeService } from './grade.service';
import { Get, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { Grade } from 'entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { SolvingService } from 'modules/solving/solving.service';
import { QuestionService } from 'modules/question/question.service';

@ApiTags('Grades')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('grade')
export class GradeController {
  constructor(
    private readonly gradeService: GradeService,
    @Inject(SolvingService) private readonly solvingService: SolvingService,
    @Inject(QuestionService) private readonly questionService: QuestionService,
  ) {}

  @ApiOkResponse({ description: 'Get latest grade from question' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Query('userId') userId: string,
    @Query('questionId') questionId: string,
  ): Promise<Grade> {
    const courseId = (await this.questionService.findById(questionId)).id;
    const solvingDate = (
      await this.solvingService.findBy({
        user: userId,
        course: courseId,
      })
    ).startedAt;
    return this.gradeService.findLatest(userId, questionId, solvingDate);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Grade a questioin' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeService.create(createGradeDto);
  }
}
