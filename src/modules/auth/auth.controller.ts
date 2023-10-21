import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'decorators/public.decorator';
import { User } from 'entities/user.entity';
import { Request, Response } from 'express';
import { RequestWithUser } from 'interfaces/auth.interface';

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({ description: 'Creates a new user with credentials' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Login with existing user account' })
  @ApiBody({ required: true, type: LoginUserDto })
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      expires: new Date(Date.now() + 3600 * 1000 * 24 * 180 * 1),
    });
    return req.user;
  }

  @Get()
  @ApiOkResponse({
    description: 'Retrive information about currently logged in user',
  })
  @HttpCode(HttpStatus.OK)
  async user(@Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token'];
    return this.authService.user(cookie);
  }

  @Post('signout')
  @ApiOkResponse({ description: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }
}
