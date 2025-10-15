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
import { User } from "src/db/schemas/user.schema";
import { hashPassword, verifyPassword } from "src/utils/auth";
import { LoginReqDto } from "./dtos/LoginDto";
import { SignupReqDto } from "./dtos/SignupDto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async _createUser(userDetails: SignupReqDto) {
    const newUser = await this.userModel.create({
      name: userDetails.name,
      email: userDetails.email,
      username: userDetails.username,
      password: await hashPassword(userDetails.password),
    });

    return newUser._id;
  }

  private async _generateToken(id: string) {
    // new user objectid as jwt payload
    const token = await this.jwtService.signAsync(
      { id },
      { subject: id, expiresIn: "1d" },
    );

    await this.cacheManager.set(`jwt-token-${id}`, token, 86400 * 1000); // 1 day

    return token;
  }

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
      return await this._generateToken(newId.toString());
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

      return await this._generateToken(existingUser._id.toString());
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
    if (!logoutDetails) throw new UnauthorizedException("Invalid credentials");

    await this.cacheManager.del(`jwt-token-${logoutDetails.id}`);
  }
}
