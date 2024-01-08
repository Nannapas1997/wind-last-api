import { Test, TestingModule } from '@nestjs/testing';
import { LeaseDetailController } from './lease-detail.controller';
import { LeaseDetailService } from './lease-detail.service';

describe('LeaseDetailController', () => {
  let controller: LeaseDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaseDetailController],
      providers: [LeaseDetailService],
    }).compile();

    controller = module.get<LeaseDetailController>(LeaseDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
