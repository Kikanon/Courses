import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { Grade } from './grade.entity';
import { Course } from './course.entity';
import { Base } from './base.entity';
import { Solving } from './solving.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @OneToMany(() => Grade, (grade) => grade.user) grades: Grade[];

  @OneToMany(() => Course, (course) => course.author)
  courses: Course[];

  @OneToMany(() => Solving, (solving) => solving.user)
  solving: Solving[];
}
