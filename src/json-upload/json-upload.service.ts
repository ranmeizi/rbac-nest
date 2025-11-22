import { Injectable, NotFoundException } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOss } from '../entities/user_oss.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JsonUploadService {
  private readonly client: OSS;

  constructor(
    @InjectRepository(UserOss)
    private readonly userOssRepository: Repository<UserOss>,
  ) {
    // 初始化 OSS 客户端
    this.client = new OSS({
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_UPLOAD_BUCKET,
      region: process.env.OSS_UPLOAD_REGION,
      secure: true, // 使用 https
    });
  }

  /**
   * 为用户生成 PUT 签名 URL（用于上传 JSON）
   * @param uid 用户 ID
   * @returns {Promise<{url: string, method: string, headers: {'Content-Type': string}}>}
   */
  async getJsonUploadUrl(uid: string) {
    // 文件名规则：user-{uid}/{uid}.json
    const objectKey = `user-${uid}/${uid}.json`;
    const url = this.client.signatureUrl(objectKey, {
      method: 'PUT',
      expires: 60, // 签名有效期 1 分钟
      'Content-Type': 'application/json',
    });

    // 使用现有 user_oss 表，按用户 ID 进行 upsert
    const existing = await this.userOssRepository.findOne({
      where: { userId: uid },
    });
    if (existing) {
      await this.userOssRepository.update(
        { userId: uid },
        { ossUrl: objectKey },
      );
    } else {
      const record = this.userOssRepository.create({
        userId: uid,
        ossUrl: objectKey,
      });
      await this.userOssRepository.save(record);
    }

    return {
      url,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  /**
   * 为用户生成 GET 签名 URL（用于下载 JSON）
   * @param uid 用户 ID
   * @returns {Promise<{url: string}>}
   */
  async getJsonDownloadUrl(uid: string) {
    // 从 user_oss 表查找该用户的 objectKey（存储在 ossUrl 字段）
    const record = await this.userOssRepository.findOne({
      where: { userId: uid },
    });
    if (!record || !record.ossUrl) {
      throw new NotFoundException('未找到对应的 JSON 文件记录');
    }
    const objectKey = record.ossUrl;

    // 生成下载签名 URL
    const url = this.client.signatureUrl(objectKey, {
      method: 'GET',
      expires: 60, // 签名有效期 1 分钟
    });
    return { url };
  }
}
