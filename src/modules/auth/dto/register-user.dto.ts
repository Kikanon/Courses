import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { Match } from 'decorators/match.decorator';

export class RegisterUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Match(RegisterUserDto, (field: RegisterUserDto) => field.password, {
    message: 'Passwords do not match.',
  })
  confirm_password: string;
}
