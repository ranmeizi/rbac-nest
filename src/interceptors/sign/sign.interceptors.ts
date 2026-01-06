import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getParamsBackend } from './util';
import { BusinessException } from 'src/error-handler/BusinessException';
import * as crypto from 'crypto';

@Injectable()
export class SignInterceptor implements NestInterceptor {
  // TODO 接口例外
  exlude = [
    '/api/v1/sign/get-sign-params',
    '/api/v1/sign/get-sign-params-with-params',
  ];
  /**
   * 验证时间戳
   */
  private validateTimestamp(timestamp: number): boolean {
    const now = Date.now();
    const diff = Math.abs(now - timestamp);

    // 允许5分钟（300000毫秒）的误差
    return diff <= 5 * 60 * 1000;
  }

  /**
   * 验证随机数（防重放攻击）
   * 实际项目中应使用Redis或数据库存储已使用的nonce
   */
  private async validateNonce(
    nonce: string,
    timestamp: number,
  ): Promise<boolean> {
    // 这里实现防重放逻辑

    // 方案1：使用内存存储（适用于单机）
    // 方案2：使用Redis存储（推荐，适用于分布式）

    // TODO: 实现实际的nonce存储和检查逻辑
    // 例如：将nonce存储在Redis中，设置5分钟过期

    return true;
  }

  /**
   * 计算签名
   */
  private calculateSignature(signString: string, appSecret: string): string {
    return crypto
      .createHmac('sha256', appSecret)
      .update(signString)
      .digest('hex')
      .toLowerCase();
  }
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    // 获取 签名
    const sign = request.headers['x-signature'];
    const timestamp = request.headers['x-timestamp'];
    const nonce = request.headers['x-nonce'];

    let reason = '';

    try {
      // 判断必要参数 暂时不要
      if (!sign || !timestamp || !nonce) {
        reason = '[signature_interceptor]签名系统参数header缺失';
        throw new BusinessException('无效请求', '400');
      }

      // 验证时间戳（允许5分钟误差）
      const timestampNum = parseInt(timestamp, 10);
      if (!this.validateTimestamp(timestampNum)) {
        reason = '[signature_interceptor]时间戳无效';
        throw new BusinessException('无效请求', '400');
      }

      // 验证随机数（防重放攻击）
      const nonceValid = await this.validateNonce(nonce, timestampNum);
      if (!nonceValid) {
        reason = '[signature_interceptor]随机数重复';
        throw new BusinessException('无效请求', '400');
      }

      // 加密字符串
      const paramsString = getParamsBackend(request);

      // 计算签名
      const serverSign = this.calculateSignature(
        paramsString,
        process.env.SIGNATURE_SECRET,
      );

      // 8. 比较签名
      if (serverSign !== sign?.toLowerCase?.()) {
        reason = '[signature_interceptor]签名错误';
        throw new BusinessException('无效请求', '400');
      }
    } catch (error) {}

    return next.handle().pipe(
      map((data) => {
        console.log('kankan', data);
        if (data && typeof data === 'object') {
          return { ...data, sign_error: reason };
        }
        return data;
      }),
    );
  }
}
