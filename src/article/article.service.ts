import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/user/user.entity";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleEntity } from "@app/article/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponse.interface";

@Injectable()
export class ArticleService{
  constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
              private dataSource: DataSource,
              @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async findAll(query,currentUserId):Promise<ArticlesResponseInterface>{
    const queryBuilder = this.dataSource.getRepository(ArticleEntity).createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author')

    if(query.author){
      const author = await this.userRepository.findOne({where: {username: query.author}})
      queryBuilder.andWhere('articles.authorId = :id', {id: author.id})
    }

    const articlesCount = await queryBuilder.getCount()

    if(query.tag){
      queryBuilder.andWhere('articles.tagList Like :tag', {tag: `%${query.tag}%`})
    }

    if(query.favorited){
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites']
      })
      const ids = author.favorites.map(el => el.id)
      if(ids.length){
        queryBuilder.andWhere('articles.id IN (:...ids)', {ids})
      } else {
        queryBuilder.andWhere('1=0')
      }

    }

    if(query.limit){
      queryBuilder.limit(query.limit)
    }

    if(query.offset){
      queryBuilder.offset(query.offset)
    }

    let favoriteIds: number[] = []
    if(currentUserId){
      const currentUser = await this.userRepository.findOne({where: {id: currentUserId}, relations: ['favorites']})
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id)
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC')

    const articles = await queryBuilder.getMany()
    const articlesWithFavorites = articles.map(article => {
      const favorited = favoriteIds.includes(article.id)
      return {...article, favorited}
    })


    return {articles: articlesWithFavorites, articlesCount}
  }

  async addArticleToFavorites(slug:string, currentUserId: number): Promise<ArticleEntity>{
    const article = await this.findBySlug(slug)
    const user = await this.userRepository.findOne({where: {id: currentUserId}, relations: ['favorites']})
    const isNotFavorites = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1
    if(isNotFavorites){
      user.favorites.push(article)
      article.favoritesCount++
      await this.userRepository.save(user)
      await this.articleRepository.save(article)
    }
    return article
  }

  async deleteArticleToFavorites(slug:string, currentUserId: number): Promise<ArticleEntity>{
    const article = await this.findBySlug(slug)
    const user = await this.userRepository.findOne({where: {id: currentUserId}, relations: ['favorites']})
    const articleIndex = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id)

    if(articleIndex >= 0){
      user.favorites.splice(articleIndex, 1)
      article.favoritesCount--
      await this.userRepository.save(user)
      await this.articleRepository.save(article)
    }
    return article
  }

  async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity>{
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)

    if(!article.tagList){
      article.tagList = []
    }
    article.slug = this.getSlug(createArticleDto.title)

    article.author = currentUser

    return await this.articleRepository.save(article)
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface{
    return {article}
  }

  private getSlug(title: string): string{
    return slugify(title,{lower: true}) + '-' + ((Math.random() * Math.pow(36,6)) | 0).toString(36)
  }

  async findBySlug(slug: string):Promise<ArticleEntity>{
    const article = await this.articleRepository.findOne({where: {slug}})
    return article
  }

  async deleteArticle(currentUserId: number, slug: string): Promise<DeleteResult>{

    const article = await this.findBySlug(slug)

    if(!article){
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }
    if(article.author.id !== currentUserId){
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)
    }

    return await  this.articleRepository.delete({slug})
  }

  async updateArticle(currentUserId: number, slug: string, updateArticleDto: CreateArticleDto): Promise<ArticleEntity>{

    const article = await this.findBySlug(slug)

    if(!article){
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }
    if(article.author.id !== currentUserId){
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)
    }

    Object.assign(article, updateArticleDto)

    return await this.articleRepository.save(article)
  }
}
