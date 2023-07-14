import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data && request.user != undefined) {
      return request.user[data as keyof typeof request.user];
    }
    return request.user;
  },
);
