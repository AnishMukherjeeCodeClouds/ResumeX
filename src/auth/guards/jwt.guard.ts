import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import z from "zod";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private _extractToken(request: Request) {
    // No authorization header
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader)
      throw new UnauthorizedException("Invalid Credentials");

    // No token
    const [scheme, token] = authorizationHeader.split(" ");
    if (!token || scheme.toLowerCase() !== "bearer")
      throw new UnauthorizedException("Invalid Credentials");

    // Invalid string instead of valid jwt format
    const parseResult = z.jwt().safeParse(token);
    if (!parseResult.success)
      throw new UnauthorizedException("Invalid Credentials");

    return parseResult.data;
  }

  private async _decodeToken(token: string) {
    try {
      const payload: { id: string; isRefresh?: boolean } =
        await this.jwtService.verifyAsync(token);

      // Reject refresh tokens
      if (payload.isRefresh)
        throw new UnauthorizedException("Invalid Credentials");

      return payload;
    } catch {
      throw new UnauthorizedException("Invalid Credentials");
    }
  }

  async canActivate(context: ExecutionContext) {
    // Get hold of the incoming request object
    const request = context.switchToHttp().getRequest<Request>();

    // Get the token from the authorization header
    const token = this._extractToken(request);

    // Get the payload from the jwt token
    const { id: userId } = await this._decodeToken(token);

    // // Check if the token is the same token in the cache
    // const tokenInCache: string | undefined = await this.cacheManager.get(
    //   `jwt-token-${userId}`,
    // );
    // if (!tokenInCache || tokenInCache !== token)
    //   throw new UnauthorizedException("Invalid Credentials");

    // Set the decoded id on request for later use in controllers
    request.user = { id: userId };
    return true;
  }
}
