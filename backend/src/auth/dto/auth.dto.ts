import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PlatformStatDto {
  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsNumber()
  followers: number;

  @IsNumber()
  avgViews: number;

  @IsNumber()
  avgLikes: number;

  @IsNumber()
  avgComments: number;
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  passwordHash: string;

  @IsEnum(['INFLUENCER', 'BUSINESS'])
  role: 'INFLUENCER' | 'BUSINESS';

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  // Influencer 
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  achievements?: string;

  // Business
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  targetLocation?: string;

  // Social Stats for influencers
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformStatDto)
  platformStats?: PlatformStatDto[];
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string; // the code still uses passwordHash as field name but it's plain text here
}
