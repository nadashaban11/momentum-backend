import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsOptional, isString, IsString, MinLength } from "class-validator";

export class SignUpDto{
    @IsString()
    @IsNotEmpty({message: 'name is required'})
    name!: string;

    @IsString()
    @IsNotEmpty({message: 'username is required'})
    username!: string;

    @IsString()
    @IsNotEmpty({message: 'email is required'})
    @IsEmail({}, {message: 'enter a valid email'})
    email!: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password!: string;

    @IsString()
    @IsOptional()
    avatarUrl!: string;
}

export class SignInDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}