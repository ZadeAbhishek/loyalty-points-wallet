import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extracting the request from the execution context
    const request = context.switchToHttp().getRequest();
    // Extracting the token from the request header
    const token = this.extractTokenFromHeader(request);

    // If no token is found, throw an UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verifying the token using the JwtService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      
      // 💡 Storing the payload in the request object for access in route handlers
      request['user'] = payload;
    } catch {
      // Catching any verification errors and throwing UnauthorizedException
      throw new UnauthorizedException();
    }
    
    return true;
  }

  // Function to extract the token from the Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
