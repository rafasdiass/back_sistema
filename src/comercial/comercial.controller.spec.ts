import { Test, TestingModule } from '@nestjs/testing';
import { ComercialController } from './comercial.controller';
import { ComercialService } from './comercial.service';

describe('ComercialController', () => {
  let controller: ComercialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComercialController],
      providers: [ComercialService],
    }).compile();

    controller = module.get<ComercialController>(ComercialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
