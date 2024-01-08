import { Test, TestingModule } from '@nestjs/testing';
import { LeaseDetailService } from './lease-detail.service';

describe('LeaseDetailService', () => {
  let service: LeaseDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaseDetailService],
    }).compile();

    service = module.get<LeaseDetailService>(LeaseDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
