import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";

@Injectable()
export class AuthGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequestInterface>()

    if(request.user){
      return true
    }

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
  }
}
