import { Injectable } from '@nestjs/common';

@Injectable()
export class ResService {
  // 代码
  BCodes = {};

  success(data: any) {
    return {
      code: '200',
      msg: '',
      data: data,
    };
  }

  error() {}
}
