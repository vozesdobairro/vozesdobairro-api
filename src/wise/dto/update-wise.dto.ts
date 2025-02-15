import { PartialType } from '@nestjs/mapped-types';
import { CreateWiseDto } from './create-wise.dto';

export class UpdateWiseDto extends PartialType(CreateWiseDto) {}
