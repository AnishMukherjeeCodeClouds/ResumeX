import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model } from "mongoose";
import { hashPassword, verifyPassword } from "src/auth/utils";
import { User } from "src/db/schemas/user.schema";
import { LoginReqDto } from "./dtos/login.dto";
import { RefreshReqDto } from "./dtos/refresh.dto";
import { SignupReqDto } from "./dtos/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signup(signupDetails: SignupReqDto) {
    try {
      // Check if user already exists
      const existingUser = await this.userModel
        .findOne({
          $or: [
            { email: signupDetails.email },
            { username: signupDetails.username },
          ],
        })
        .exec();

      if (existingUser)
        throw new ConflictException("Similar user already exists");

      const newId = await this._createUser(signupDetails);
      const [accessToken, refreshToken] = await Promise.all([
        this._generateToken({
          payload: { id: newId.toString() },
          expiresIn: "30m",
        }),
        this._generateToken({
          payload: { id: newId._id.toString(), isRefresh: true },
          expiresIn: "7d",
        }),
      ]);

      await this.cacheManager.set(
        `refresh-token-${newId.toString()}`,
        refreshToken,
      );

      return { accessToken, refreshToken };
    } catch (error) {
      // Rethrow known exceptions
      [ConflictException].some((e) => {
        if (error instanceof e) throw error;
      });

      // Bad request for all other errors
      throw new BadRequestException(
        "Error While Signing Up",
        (error as Error).message,
      );
    }
  }

  async login(loginDetails: LoginReqDto) {
    try {
      // Check if user exists or not
      const existingUser = await this.userModel
        .findOne({
          $or: [
            { email: loginDetails.email },
            { username: loginDetails.username },
          ],
        })
        .exec();
      if (!existingUser)
        throw new NotFoundException("Invalid user credentials");

      // Check if password is the same as the one passed during signup
      const isPasswordValid = await verifyPassword(
        existingUser.password,
        loginDetails.password,
      );
      if (!isPasswordValid)
        throw new UnauthorizedException("Invalid user credentials");

      const [accessToken, refreshToken] = await Promise.all([
        this._generateToken({
          payload: { id: existingUser._id.toString() },
          expiresIn: "30m",
        }),
        this._generateToken({
          payload: { id: existingUser._id.toString(), isRefresh: true },
          expiresIn: "7d",
        }),
      ]);

      await this.cacheManager.set(
        `refresh-token-${existingUser._id.toString()}`,
        refreshToken,
      );

      return { accessToken, refreshToken };
    } catch (error) {
      // Rethrow known exceptions
      [NotFoundException, UnauthorizedException].some((e) => {
        if (error instanceof e) throw error;
      });

      // Bad request for all other errors
      throw new BadRequestException(
        "Error While Logging In",
        (error as Error).message,
      );
    }
  }

  async logout(logoutDetails: Request["user"]) {
    if (!logoutDetails) throw new UnauthorizedException("Invalid Credentials");

    await this.cacheManager.del(`jwt-token-${logoutDetails.id}`);
  }

  async refresh({ refreshToken }: RefreshReqDto) {
    try {
      // Verify refresh token
      const refreshPayload: { id: string; isRefresh?: boolean } =
        await this.jwtService.verifyAsync(refreshToken);

      // Reject access tokens
      if (!refreshPayload.isRefresh)
        throw new UnauthorizedException("Invalid Credentials");

      // Check if the refresh token same as the one in cache
      if (
        !(
          (await this.cacheManager.get(
            `refresh-token-${refreshPayload.id}`,
          )) === refreshToken
        )
      )
        throw new UnauthorizedException("Invalid Credentials");

      // Generate new access and refresh tokens
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this._generateToken({
          payload: { id: refreshPayload.id },
          expiresIn: "30m",
        }),
        this._generateToken({
          payload: { id: refreshPayload.id, isRefresh: true },
          expiresIn: "7d",
        }),
      ]);

      await this.cacheManager.set(
        `refresh-token-${refreshPayload.id}`,
        newRefreshToken,
      );

      return { newAccessToken, newRefreshToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("Invalid Credentials");
    }
  }

  private async _createUser(userDetails: SignupReqDto) {
    const newUser = await this.userModel.create({
      name: userDetails.name,
      email: userDetails.email,
      username: userDetails.username,
      password: await hashPassword(userDetails.password),
    });

    return newUser._id;
  }

  private async _generateToken<T extends Record<string, unknown>>({
    payload,
    expiresIn,
  }: {
    payload: T;
    expiresIn: `${number}${"s" | "m" | "h" | "d"}`;
  }) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return token;
  }
}
