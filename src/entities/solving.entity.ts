import { Base } from './base.entity';
import { Entity, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity()
export class Solving extends Base {
  @ManyToOne(() => User, (user) => user.solving, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Course, (course) => course.solvers, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column()
  startedAt: Date;
}
