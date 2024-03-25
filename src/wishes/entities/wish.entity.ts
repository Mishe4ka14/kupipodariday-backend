import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl({}, { message: 'Некорректный URL-адрес' })
  link: string;

  @Column()
  @IsUrl({}, { message: 'Некорректный URL-адрес' })
  image: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  raised: number;

  @Column()
  @Length(1, 1024)
  discription: string;

  @Column({ type: 'int' })
  copied: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
