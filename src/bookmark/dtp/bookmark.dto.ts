
import { IsOptional, IsString } from 'class-validator';
export class CreateBookmarkDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    link?: string;
}