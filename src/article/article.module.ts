import { Module } from "@nestjs/common";
import { ArticleController } from "@app/article/article.controller";
import { ArticleService } from "@app/article/article.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "@app/article/article.entity";
import { UserEntity } from "@app/user/user.entity";
import { FollowEntity } from "@app/Profile/follow.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule{

}
