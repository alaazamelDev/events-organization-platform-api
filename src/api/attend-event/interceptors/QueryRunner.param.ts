import { createParamDecorator } from '@nestjs/common';

export const QueryRunnerParam: () => ParameterDecorator = () => {
  return createParamDecorator((_data, req) => {
    return req.queryRunner;
  });
};
