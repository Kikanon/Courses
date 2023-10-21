import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SolvingDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  course_id: string;
}
