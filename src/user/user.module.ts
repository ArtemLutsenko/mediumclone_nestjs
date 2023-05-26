import { Module } from "@nestjs/common";
import { UserController } from "@app/user/user.controller";
import { UserService } from "@app/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { AuthGuard } from "@app/user/guards/auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService]
})

export class UserModule{}
