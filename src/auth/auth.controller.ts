import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { type Request } from "express";
import { ZodResponse } from "nestjs-zod";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto } from "./dtos/LoginDto";
import { LogoutDto } from "./dtos/LogoutDto";
import { SignupReqDto, SignupResDto } from "./dtos/SignupDto";
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
    const accessToken = await this.authService.signup(signupReqDto);
    return {
      message: "Signed up successfully",
      accessToken,
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
    const accessToken = await this.authService.login(loginReqDto);
    return {
      message: "Logged in successfully",
      accessToken,
      statusCode: HttpStatus.OK,
    };
  }

  @ApiBearerAuth()
  @Post("logout")
  @UseGuards(JwtGuard)
  @ZodResponse({
    type: LogoutDto,
    description: "Log out of current session",
    status: HttpStatus.OK,
  })
  async logout(@Req() request: Request) {
    await this.authService.logout(request.user);
    return {
      message: "",
      statusCode: HttpStatus.OK,
    };
  }
}
