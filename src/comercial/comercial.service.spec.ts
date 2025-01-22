import { Test, TestingModule } from '@nestjs/testing';
import { ComercialService } from './comercial.service';

describe('ComercialService', () => {
  let service: ComercialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComercialService],
    }).compile();

    service = module.get<ComercialService>(ComercialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
