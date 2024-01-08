import { IsOptional } from 'class-validator';

export class CreateDocumentDto {
  document_title?: string;
  document_description?: string;

  @IsOptional()
  document_file: any;
  file?: string;
  project_name?: string;
  name?: string;
}
