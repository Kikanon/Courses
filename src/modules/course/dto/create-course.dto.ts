import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  author_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;
}
