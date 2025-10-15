import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ZodSerializerDto } from "nestjs-zod";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto } from "./dtos/LoginDto";
import { SignupReqDto, SignupResDto } from "./dtos/SignupDto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @ZodSerializerDto(SignupResDto)
  async signup(@Body() signupReqDto: SignupReqDto) {
    const accessToken = await this.authService.signup(signupReqDto);
    return {
      message: "Signed up successfully",
      ...signupReqDto,
      accessToken,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(LoginResDto)
  async login(@Body() loginReqDto: LoginReqDto) {
    const accessToken = await this.authService.login(loginReqDto);
    return {
      message: "Logged in successfully",
      accessToken,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("logout")
  async logout() {}
}
