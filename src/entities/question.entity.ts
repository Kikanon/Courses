import { Base } from './base.entity';
import { Entity, JoinColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Grade } from './grade.entity';

@Entity()
export class Question extends Base {
  @JoinColumn({ name: 'author_id' })
  @ManyToOne(() => Course, (course) => course.questions, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @OneToMany(() => Grade, (grade) => grade.question)
  grades: Grade[];

  @Column()
  question: string;

  @Column()
  answer: string;
}
