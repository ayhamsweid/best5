import { Injectable } from '@nestjs/common';
import { AuditActionType, AuditEntityType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const toJson = (value: Prisma.InputJsonValue | null | undefined) =>
  value === undefined || value === null ? Prisma.JsonNull : value;

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  list(limit = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { created_at: 'desc' },
      take: Math.min(Math.max(limit, 1), 500),
      include: {
        actor_user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  log(
    actorUserId: string | null | undefined,
    actionType: AuditActionType | keyof typeof AuditActionType,
    entityType: AuditEntityType | keyof typeof AuditEntityType,
    entityId?: string | null,
    before?: Prisma.InputJsonValue | null,
    after?: Prisma.InputJsonValue | null
  ) {
    return this.prisma.auditLog.create({
      data: {
        actor_user_id: actorUserId || null,
        action_type: actionType as AuditActionType,
        entity_type: entityType as AuditEntityType,
        entity_id: entityId || null,
        before_json: toJson(before),
        after_json: toJson(after)
      }
    });
  }
}
