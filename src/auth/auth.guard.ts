import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import User from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    if (!payload.sub) {
      throw new UnauthorizedException();
    }

    const user = await User.findOne({
      where: {
        id: payload.sub,
        /* verified_at: {
                [Op.ne]: null,
            }, */
      },
      include: [
        {
          association: 'organizations',
          through: {
            where: {
              employeeship_status: 'confirmed',
            },
          },
        },
      ],
      attributes: {
        exclude: ['password'],
      },
      paranoid: false,
    });

    if (!user)
      throw new NotFoundException(
        'No user found. Contact administration about your account.',
      );

    if (user.deleted_at)
      throw new UnauthorizedException(
        `Your account was archived on ${user.deleted_at.toDateString()}. Contact with administration.`,
      );

    if (!user.is_active)
      throw new UnauthorizedException(
        'Your account is temporarily suspended. Contact with administration.',
      );

    const sessions = await user.$get('sessions', {
      where: {
        jwt: token,
      },
    });

    const session = sessions[0];

    if (!session) throw new UnauthorizedException();

    if (!!session.logged_out_at)
      throw new UnauthorizedException(
        `This session is signed out at ${session.logged_out_at?.toDateString()}. Please sign in again.`,
      );

    request['user'] = user;
    request['jwt_token'] = token;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
