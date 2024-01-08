import { Test, TestingModule } from '@nestjs/testing';
import { ImageVideoController } from './image-video.controller';
import { ImageVideoService } from './image-video.service';

describe('ImageVideoController', () => {
  let controller: ImageVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageVideoController],
      providers: [ImageVideoService],
    }).compile();

    controller = module.get<ImageVideoController>(ImageVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
