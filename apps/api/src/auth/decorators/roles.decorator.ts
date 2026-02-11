import { SetMetadata } from '@nestjs/common';
import type { Role } from '@corporate/db'; // Берем Enum прямо из нашей базы

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
