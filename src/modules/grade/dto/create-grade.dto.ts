import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^[12345]{1}$/, {
    message: 'Value can only be 1-5.',
  })
  value: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  questionId: string;
}
