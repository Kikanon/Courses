import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger/dist/index';
import {
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import { Course } from 'entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { QuestionService } from 'modules/question/question.service';
import { CreateQuestionDto } from 'modules/question/dto/create-question.dto';
import { Question } from 'entities/question.entity';
import { Solving } from 'entities/solving.entity';
import { SolvingService } from 'modules/solving/solving.service';
import { SolvingDto } from 'modules/solving/dto/solving.dto';
import { GradeService } from 'modules/grade/grade.service';
import Logging from 'library/Logging';
import { CompletedPercentageDto } from './dto/completed-percentage.dto';

@ApiTags('Courses')
@Controller('course')
@UseInterceptors(ClassSerializerInterceptor)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    @Inject(QuestionService) private readonly questionService: QuestionService,
    @Inject(SolvingService) private readonly solvingService: SolvingService,
    @Inject(GradeService) private readonly gradeService: GradeService,
  ) {}

  @ApiOkResponse({ description: 'List all courses' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.courseService.paginate(page, ['author']);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create a new course' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  @Post('startCourse')
  @ApiCreatedResponse({ description: 'Start learning a new course' })
  @HttpCode(HttpStatus.CREATED)
  async startCourse(@Body() createSolvingDto: SolvingDto): Promise<Solving> {
    return this.solvingService.create(createSolvingDto);
  }

  @Post('resetCourse')
  @ApiOkResponse({ description: 'Reset course progress' })
  @HttpCode(HttpStatus.OK)
  async resetCourse(@Body() restartSolvingDto: SolvingDto): Promise<Solving> {
    try {
      // get all questions from the course
      const course = await this.courseService.findById(
        restartSolvingDto.course_id,
        ['questions'],
      );
      const solvingDate = (
        await this.solvingService.findBy({
          user: { id: restartSolvingDto.user_id },
          course: { id: restartSolvingDto.course_id },
        })
      ).startedAt;

      // get current grades for those questions
      const grades = await this.gradeService.getGrades(
        restartSolvingDto.user_id,
        course.questions,
        solvingDate,
      );
      // check if they are all completed
      if (
        grades.includes(null) ||
        grades.some((grade) => grade.gradeValue != 5)
      ) {
        throw new BadRequestException('User has not completed all questions.');
      }

      return this.solvingService.restartCourse(restartSolvingDto);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'You can only restart a course when completing all questions',
      );
    }
  }

  @Get('getStats/:id')
  @ApiOkResponse({ description: 'Get percentage of questions completed.' })
  @HttpCode(HttpStatus.OK)
  async getStats(
    @Param('id') courseId: string,
    @Query('userId') userId: string,
  ): Promise<CompletedPercentageDto> {
    try {
      // get all questions from the course
      const course = await this.courseService.findById(courseId, ['questions']);

      const solvingDate = (
        await this.solvingService.findBy({
          user: { id: userId },
          course: { id: courseId },
        })
      ).startedAt;

      // get current grades for those questions
      const grades = await this.gradeService.getGrades(
        userId,
        course.questions,
        solvingDate,
      );
      // calculate percentage
      const totalQuestions = course.questions.length;
      const completedQuestions = grades.reduce((count, grade) => {
        if (grade !== null) {
          return count + 1;
        }
        return count;
      }, 0);

      return {
        message: `Completed Percentage`,
        value: (completedQuestions / totalQuestions) * 100,
      };
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('Problem calculating statistics');
    }
  }

  @Post(':id')
  @ApiCreatedResponse({ description: 'Create a new question' })
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(
    @Param('id') courseId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionService.create(courseId, createQuestionDto);
  }

  @ApiOkResponse({ description: 'Return course data from id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findById(id, ['author', 'questions']);
  }
}
