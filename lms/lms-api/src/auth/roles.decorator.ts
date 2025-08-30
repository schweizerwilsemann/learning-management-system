import { SetMetadata } from '@nestjs/common';

// Usage: @Roles('ADMIN', 'INSTRUCTOR')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export default Roles;
