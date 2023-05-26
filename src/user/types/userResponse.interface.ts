import { UserEntity } from "@app/user/user.entity";
import { UserType } from "@app/user/types/user.type";

export interface UserResponseInterface {
  user: UserType & {token : string}
}
