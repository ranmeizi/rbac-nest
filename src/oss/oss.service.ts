import { Injectable } from '@nestjs/common';
import * as Client from 'ali-oss';
import * as dayjs from 'dayjs';
import { HOST } from 'src/constants';
@Injectable()
export class OssService {
  async getSignature() {
    const config = {
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET, // 文件存储路径
      dir: process.env.OSS_DIR,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const client = new Client(config);
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5); // 策略的过期时间
    const policy = {
      // 设置签名的有效期，格式为Unix时间戳
      expiration: date.toISOString(),
      conditions: [
        // 限制上传文件大小5mb
        ['content-length-range', 0, 5 * 1024 * 1024],
        ['starts-with', '$Content-Type', 'image/'], // 只允许图片类型
      ],
    }; // 生成签名，策略等信息
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const formData = await client.calculatePostSignature(policy); // 生成 bucket 域名，客户端将向此地址发送请求
    const host = HOST;
    return {
      //过期时间 2分钟
      // expire: dayjs().add(2, 'minutes').unix().toString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      policy: formData.policy,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      signature: formData.Signature,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      accessId: formData.OSSAccessKeyId,
      host,
      dir: config.dir,
    };
  }
}
