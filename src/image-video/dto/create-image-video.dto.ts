import { IsOptional } from 'class-validator';

export class CreateImageVideoDto {
  category?: string;
  description?: string;

  @IsOptional()
  input_file: any;
  file?: string;
  project_name?: string;
  name?: string;
}
