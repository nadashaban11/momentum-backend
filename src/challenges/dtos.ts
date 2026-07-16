import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @IsDateString(
    {},
    { message: 'Start date must be a valid date string (YYYY-MM-DD)' },
  )
  startDate!: string;

  @IsDateString(
    {},
    { message: 'End date must be a valid date string (YYYY-MM-DD)' },
  )
  endDate!: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;
}
