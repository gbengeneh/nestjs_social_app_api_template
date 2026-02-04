// src/auth/guards/refresh.guard.ts
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {}
