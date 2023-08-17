import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVideoDto {
  @ApiProperty()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
  })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  category_id: number;
}

export class CreateVideoWithUploadDto extends CreateVideoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: string;
}
