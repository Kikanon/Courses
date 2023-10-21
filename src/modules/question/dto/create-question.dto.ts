import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  answer: string;
}
