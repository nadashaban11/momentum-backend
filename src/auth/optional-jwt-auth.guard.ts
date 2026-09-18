import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Allows anonymous explore: if no/invalid token, req.user = null instead of 401.
// Private checks happen later in the service.
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(_err: any, user: any) {
    return user || null;
  }
}
