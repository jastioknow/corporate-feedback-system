import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@corporate/db';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.ADMIN]: 1,
  [Role.USER]: 2,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user.role) {
      throw new ForbiddenException('У вас недостаточно прав');
    }

    const minRequiredPriority = Math.max(
      ...requiredRoles.map((role) => ROLE_HIERARCHY[role]),
    );
    const userPriority = ROLE_HIERARCHY[user.role];

    if (userPriority > minRequiredPriority) {
      throw new ForbiddenException('У вас недостаточно прав');
    }

    return true;
  }
}
