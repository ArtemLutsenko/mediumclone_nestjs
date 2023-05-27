import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ArticleService } from "@app/article/article.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { User } from "@app/user/decorators/user.decorator";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponse.interface";

@Controller('articles')
export class ArticleController{

  constructor(private readonly articleService: ArticleService) {
  }

  @Get()
  async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface>{

    return await this.articleService.findAll(query,currentUserId)
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticlesToFavorites(@User('id') currentUserId: number, @Param('slug') slug: string) : Promise<ArticleResponseInterface>{
    const article = await  this.articleService.addArticleToFavorites(slug, currentUserId)

    return this.articleService.buildArticleResponse(article)
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticlesToFavorites(@User('id') currentUserId: number, @Param('slug') slug: string) : Promise<ArticleResponseInterface>{
    const article = await  this.articleService.deleteArticleToFavorites(slug, currentUserId)

    return this.articleService.buildArticleResponse(article)
  }


  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto) : Promise<ArticleResponseInterface>{
   const article = await this.articleService.createArticle(currentUser, createArticleDto)
    return this.articleService.buildArticleResponse(article)
  }

  @Get('/:slug')
  @UseGuards(AuthGuard)
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface>{
    const article = await  this.articleService.findBySlug(slug)
    return this.articleService.buildArticleResponse(article)
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string){
    return this.articleService.deleteArticle(currentUserId, slug)
  }
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(@User('id') currentUserId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: CreateArticleDto) :Promise<ArticleResponseInterface>{
    const article = await this.articleService.updateArticle(currentUserId, slug, updateArticleDto)
    return this.articleService.buildArticleResponse(article)
  }
}
