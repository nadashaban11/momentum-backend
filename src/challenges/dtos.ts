import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({
    example: 'Backend Sprint',
    description: 'Title of the challenge',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @ApiProperty({
    example: 'Building momentum with NestJS and TypeORM',
    description: 'Challenge details',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @ApiProperty({
    example: '2026-07-25',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString(
    {},
    { message: 'Start date must be a valid date string (YYYY-MM-DD)' },
  )
  startDate!: string;

  @ApiProperty({ example: '2026-08-25', description: 'End date (YYYY-MM-DD)' })
  @IsDateString(
    {},
    { message: 'End date must be a valid date string (YYYY-MM-DD)' },
  )
  endDate!: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether the challenge is public',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;
}
