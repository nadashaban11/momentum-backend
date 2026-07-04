import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsUrl({}, { message: 'avatarUrl must be a valid URL address' })
    avatarUrl?: string;
}