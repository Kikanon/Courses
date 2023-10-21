import { Base } from './base.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Solving } from './solving.entity';

@Entity()
export class Course extends Base {
  @JoinColumn({ name: 'author_id' })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  author: User;

  @Column()
  title: string;

  @OneToMany(() => Question, (question) => question.course)
  questions: Question[];

  @OneToMany(() => Solving, (solving) => solving.course)
  solvers: string[];
}
