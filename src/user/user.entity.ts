import { Entity, PrimaryGeneratedColumn, Column, 
    CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Bookmark } from '../bookmark/bookmark.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[]; // asta corespunde la user => user.bookmarks
}
