import { Module } from "@nestjs/common";
import { ProfileController } from "@app/Profile/profile.controller";
import { ProfileService } from "@app/Profile/profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { FollowEntity } from "@app/Profile/follow.entity";


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule{

}
