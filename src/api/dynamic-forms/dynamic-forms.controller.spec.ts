import { Test, TestingModule } from '@nestjs/testing';
import { DynamicFormsController } from './dynamic-forms.controller';
import { DynamicFormsService } from './dynamic-forms.service';

describe('DynamicFormsController', () => {
  let controller: DynamicFormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicFormsController],
      providers: [DynamicFormsService],
    }).compile();

    controller = module.get<DynamicFormsController>(DynamicFormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
