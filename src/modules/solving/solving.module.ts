import { Module } from '@nestjs/common';
import { SolvingService } from './solving.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solving } from 'entities/solving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solving])],
  providers: [SolvingService],
  exports: [SolvingService],
})
export class SolvingModule {}
