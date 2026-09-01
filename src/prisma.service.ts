import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { db } from '../prisma/db.js';

/**
 * NestJS wrapper around the Prisma 8 client (see prisma/db.ts).
 *
 * The client is lazy — the connection pool is only created on the first query
 * (or an explicit `connect()`), so constructing the service never touches the
 * database. Inject it anywhere and query via `db.orm.<namespace>.<Model>`
 * (e.g. `db.orm.public.User.where({ email }).first()`).
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly db = db;

  async onModuleDestroy(): Promise<void> {
    await this.db.close();
  }
}
