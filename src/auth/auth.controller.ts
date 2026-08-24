import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  AuthenticationRequestDto,
  AuthenticationResponseDto,
  LogoutRequestDto,
  RefreshTokenRequestDto,
} from "../common/dto/auth.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Log in",
    description: "Authenticates a user and returns access/refresh tokens",
  })
  @ApiBody({ type: AuthenticationRequestDto })
  @ApiResponse({
    status: 200,
    description: "Authentication successful",
    type: AuthenticationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid request" })
  @ApiResponse({ status: 429, description: "Too many authentication attempts" })
  async login(
    @Body() request: AuthenticationRequestDto,
  ): Promise<AuthenticationResponseDto> {
    return this.authService.login(request);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Log out",
    description: "Revokes the given refresh token",
  })
  @ApiBody({ type: LogoutRequestDto })
  @ApiResponse({ status: 200, description: "Logout successful" })
  @ApiResponse({ status: 400, description: "Malformed request" })
  async logout(@Body() request: LogoutRequestDto): Promise<void> {
    await this.authService.logout(request);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh access token",
    description: "Issues a new access token from a valid refresh token",
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: AuthenticationResponseDto,
  })
  @ApiResponse({ status: 401, description: "Refresh token expired or invalid" })
  async refresh(
    @Body() request: RefreshTokenRequestDto,
  ): Promise<AuthenticationResponseDto> {
    return this.authService.refresh(request);
  }
}
