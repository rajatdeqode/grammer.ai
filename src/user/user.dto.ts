import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

enum WritingFor {
  School = 'school',
  Work = 'work',
  Other = 'other',
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  password: string;

  @IsOptional()
  @IsEnum(WritingFor)
  WritingFor;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  password: string;
}

export class RefreshTokenDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
