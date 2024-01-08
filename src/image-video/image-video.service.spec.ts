import { Test, TestingModule } from '@nestjs/testing';
import { ImageVideoService } from './image-video.service';

describe('ImageVideoService', () => {
  let service: ImageVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageVideoService],
    }).compile();

    service = module.get<ImageVideoService>(ImageVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
