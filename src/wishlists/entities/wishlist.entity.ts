import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Length, IsUrl, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @IsOptional()
  @Column({ default: 'Пока ничего не известно о подборке' })
  @Length(1, 1500)
  discription: string;

  @Column()
  @IsUrl({}, { message: 'Некорректный URL-адрес' })
  image: string;

  @ManyToOne(() => User, (owner) => owner.wishlist)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
