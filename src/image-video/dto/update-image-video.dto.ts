import { PartialType } from '@nestjs/mapped-types';
import { CreateImageVideoDto } from './create-image-video.dto';

export class UpdateImageVideoDto extends PartialType(CreateImageVideoDto) {}
