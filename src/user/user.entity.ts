import { BeforeInsert, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable} from "typeorm";
import { hash } from 'bcrypt'
import { ArticleEntity } from "@app/article/article.entity";

@Entity({name: 'users'})
export class UserEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  username: string

  @Column({default: ''})
  bio: string

  @Column({default: ''})
  image: string

  @Column({select: false})
  password: string

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[]

  @BeforeInsert()
  async hashPassword(){
    this.password = await hash(this.password, 10)
  }

  @ManyToMany(()=> ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[]

}
