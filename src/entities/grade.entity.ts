import { Base } from './base.entity';
import { Entity, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity()
export class Grade extends Base {
  @ManyToOne(() => User, (user) => user.grades, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Question, (question) => question.grades, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @Column()
  gradeValue: number;

  @Column()
  gradeDate: Date;
}
