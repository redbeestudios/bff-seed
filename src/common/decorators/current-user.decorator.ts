import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserInfoDto } from "../dto/auth.dto";

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): UserInfoDto | unknown => {
    const request = ctx.switchToHttp().getRequest<{ user: UserInfoDto }>();
    return data ? (request.user as any)?.[data] : request.user;
  },
);
