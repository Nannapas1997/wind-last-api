import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaseDetailDto } from './create-lease-detail.dto';

export class UpdateLeaseDetailDto extends PartialType(CreateLeaseDetailDto) {}
