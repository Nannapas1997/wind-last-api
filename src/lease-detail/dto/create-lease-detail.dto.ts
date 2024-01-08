import { IsOptional } from 'class-validator';

export class CreateLeaseDetailDto {
  name?: string;
  windTurbine?: string;
  propertyOwner?: string;
  contactNumber?: string;
  idCardNumber?: string;
  idCardExpiryDate?: string;
  currentAddress?: string;
  landType?: string;
  numberPlot?: string;
  areaSize?: string;
  contractNumber?: string;
  leaseSigningDate?: string;
  paymentCycle?: string;
  pinMaps?: string;
  file?: string;

  @IsOptional()
  download: object;

  projectName?: string;
}
