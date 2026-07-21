import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Nada Shaban', description: 'User full name' })
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name!: string;

  @ApiProperty({ example: 'nadashaban11', description: 'Unique username' })
  @IsString()
  @IsNotEmpty({ message: 'username is required' })
  username!: string;

  @ApiProperty({ example: 'nada@example.com', description: 'User email address' })
  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'enter a valid email' })
  email!: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'User profile image URL' })
  @IsString()
  @IsOptional()
  avatarUrl!: string;
}

export class loginDto {
  @ApiProperty({ example: 'nada@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}