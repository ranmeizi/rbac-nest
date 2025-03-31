import { Injectable } from '@nestjs/common';

@Injectable()
export class ResService {
  // 代码
  Codes = {
    Success: '200',
  };

  private json({ code, msg, data }) {
    return {
      code,
      msg,
      data,
    };
  }

  success(data: any, msg = 'success') {
    return this.json({
      code: this.Codes.Success,
      msg: msg,
      data: data,
    });
  }

  error(code: string, msg = '', data = null) {
    return this.json({
      code,
      msg,
      data,
    });
  }

  catchError(msg: string) {
    return this.error('500', msg);
  }
}
