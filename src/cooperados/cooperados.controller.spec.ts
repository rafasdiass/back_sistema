import { Test, TestingModule } from '@nestjs/testing';
import { CooperadosController } from './cooperados.controller';
import { CooperadosService } from './cooperados.service';

describe('CooperadosController', () => {
  let controller: CooperadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CooperadosController],
      providers: [CooperadosService],
    }).compile();

    controller = module.get<CooperadosController>(CooperadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
