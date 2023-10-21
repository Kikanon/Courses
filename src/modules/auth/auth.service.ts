import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'entities/user.entity';
import { Request } from 'express';
import Logging from 'library/Logging';
import { UsersService } from 'modules/users/users.service';
import { compareHash, hash } from 'utils/bcrypt';

import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from 'interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...');
    const user = await this.usersService.findBy({ email: email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await compareHash(password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    Logging.info('User is valid.');
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword: string = await hash(registerUserDto.password);
    return await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
  }

  async generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email });
  }

  async user(cookie: string): Promise<User> {
    const decoded: JwtPayload = this.jwtService.decode(cookie) as JwtPayload;
    return this.usersService.findById(decoded.sub);
  }

  async getUserId(request: Request): Promise<string> {
    const user = request.user as User;
    return user.id;
  }
}
