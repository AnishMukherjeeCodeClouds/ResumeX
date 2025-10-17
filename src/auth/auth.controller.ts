import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto } from "./dtos/login.dto";
import { RefreshReqDto, RefreshResDto } from "./dtos/refresh.dto";
import { SignupReqDto, SignupResDto } from "./dtos/signup.dto";

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
}
