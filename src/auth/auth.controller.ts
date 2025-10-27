import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { ZodResponse } from "nestjs-zod";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto } from "./dtos/login.dto";
import { MeResDto } from "./dtos/me.dto";
import { RefreshReqDto, RefreshResDto } from "./dtos/refresh.dto";
import { SignupReqDto, SignupResDto } from "./dtos/signup.dto";
import { JwtGuard } from "./guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @ZodResponse({
    type: SignupResDto,
    description: "Sign up to register as an user and get an access token",
    status: HttpStatus.CREATED,
  })
  async signup(@Body() signupReqDto: SignupReqDto) {
    const { accessToken, refreshToken } =
      await this.authService.signup(signupReqDto);
    return {
      message: "Signed up successfully",
      accessToken,
      refreshToken,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("login")
  @ZodResponse({
    type: LoginResDto,
    description: "Log in with registered credentials and get an access token",
    status: HttpStatus.OK,
  })
  async login(@Body() loginReqDto: LoginReqDto) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginReqDto);
    return {
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("refresh")
  @ZodResponse({
    type: RefreshResDto,
    description: "Generate a new access token with using a refresh token",
    status: HttpStatus.OK,
  })
  async refresh(@Body() refreshReqDto: RefreshReqDto) {
    const { newAccessToken, newRefreshToken } =
      await this.authService.refresh(refreshReqDto);
    return {
      message: "Generated new access token",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(JwtGuard)
  @ZodResponse({
    type: MeResDto,
    description: "Get details of the currently authenticated user",
    status: HttpStatus.OK,
  })
  @Get("me")
  async getUserDetails(@Req() req: Request) {
    const { _id, name, email } = await this.authService.getUserDetails(
      req.user!.id,
    );
    return {
      message: "Fetched user details successfully",
      userDetails: { id: _id.toString(), name, email },
      statusCode: HttpStatus.OK,
    };
  }
}
