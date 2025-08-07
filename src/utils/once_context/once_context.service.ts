import { Injectable } from '@nestjs/common';
import { OnceContextEntity } from 'src/entities/ut_once_context';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class OnceContextService {
  constructor(
    private readonly onceContextRepository: Repository<OnceContextEntity>,
  ) {}

  // 删除一个
  async remove(code: string) {
    await this.onceContextRepository.delete({ code });
  }

  // 删除过期的(可能随get调用,也可能由定时调用 或是cmd调用)
  async removeExpired() {
    await this.onceContextRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }

  async set({
    context,
    ttl = 60 * 10,
    uniqueId,
  }: {
    context: Record<string, any>;
    ttl?: number;
    uniqueId?: string;
  }) {
    const res = await this.onceContextRepository.save(
      this.onceContextRepository.create({
        context,
        ttl,
        uniqueId,
      }),
    );
    // 返回主键
    return res.code;
  }

  async get(code: string) {
    await this.removeExpired();
    // 拿code获取 context
    const row = await this.onceContextRepository.findOneBy({ code });
    // 删除 code
    await this.remove(row.code);
    // 返回 context
    return row.context;
  }

  // 看看有没有唯一
  async checkHasUnique(uniqueId: string): Promise<boolean> {
    if (uniqueId === undefined) {
      return false;
    }

    // 先清理一下 过期的
    await this.removeExpired();

    // 查询一下
    const count = await this.onceContextRepository.count({
      where: { uniqueId },
    });

    return count > 0;
  }
}
