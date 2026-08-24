import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";
import { UserRole } from "../enums";

export class AuthenticationRequestDto {
  @ApiProperty({
    description: "User email",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Password (min 10 characters)",
    example: "MySecurePass123!",
    writeOnly: true,
    minLength: 10,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: "Password must be at least 10 characters long" })
  @MaxLength(128, { message: "Password must not exceed 128 characters" })
  password: string;

  @ApiProperty({
    description: "Refresh token to renew an existing session",
    required: false,
    writeOnly: true,
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class LogoutRequestDto {
  @ApiProperty({ description: "Refresh token to revoke" })
  @IsNotEmpty({ message: "refreshToken is required" })
  @IsString()
  refreshToken: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({ description: "Refresh token used to renew the session" })
  @IsNotEmpty({ message: "refreshToken is required" })
  @IsString()
  refreshToken: string;
}

export class AuthenticationResponseDto {
  @ApiProperty({ description: "Access token (JWT)" })
  accessToken: string;

  @ApiProperty({ description: "Refresh token" })
  refreshToken: string;

  @ApiProperty({ description: "Token type", example: "Bearer" })
  tokenType: string;

  @ApiProperty({ description: "Access token TTL in seconds", example: 3600 })
  expiresIn: number;

  @ApiProperty({
    description: "Refresh token TTL in seconds",
    example: 604800,
  })
  refreshExpiresIn: number;

  @ApiProperty({
    description: "Role of the authenticated user",
    enum: UserRole,
    required: false,
  })
  role?: UserRole;

  @ApiProperty({
    description: "Permissions granted to the authenticated user",
    type: [String],
    required: false,
  })
  permissions?: string[];
}

export class UserInfoDto {
  @ApiProperty({ description: "Unique user identifier" })
  userId: string;

  @ApiProperty({ description: "JWT ID", required: false })
  jti?: string;

  @ApiProperty({ description: "User email", required: false })
  email?: string;

  @ApiProperty({ description: "Username", required: false })
  username?: string;

  @ApiProperty({ description: "Full name", required: false })
  name?: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    required: false,
  })
  role?: UserRole;

  @ApiProperty({
    description: "Permissions assigned to the user",
    type: [String],
  })
  permissions: string[];

  @ApiProperty({ description: "Roles assigned to the user", type: [String] })
  roles: string[];

  @ApiProperty({ description: "Token scope", required: false })
  scope?: string;

  @ApiProperty({ description: "Token issued-at timestamp (Unix)" })
  iat: number;

  @ApiProperty({ description: "Token expiration timestamp (Unix)" })
  exp: number;
}
