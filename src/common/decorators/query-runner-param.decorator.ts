import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryRunnerParam = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.queryRunner;
  },
);
